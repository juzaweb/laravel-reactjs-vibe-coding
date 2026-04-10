<?php

namespace Juzaweb\Modules\Payment\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Payment\Enums\PaymentHistoryStatus;
use Juzaweb\Modules\Payment\Events\PaymentFail;
use Juzaweb\Modules\Payment\Events\PaymentSuccess;
use Juzaweb\Modules\Payment\Exceptions\PaymentException;
use Juzaweb\Modules\Payment\Facades\PaymentManager;
use Juzaweb\Modules\Payment\Http\Requests\CheckoutRequest;
use Juzaweb\Modules\Payment\Http\Requests\PaymentRequest;
use Juzaweb\Modules\Payment\Models\PaymentHistory;
use Juzaweb\Modules\Payment\Models\PaymentMethod;

class PaymentController extends APIController
{
    /**
     * @OA\Post(
     *      path="/api/v1/payment/{module}/checkout",
     *      tags={"Payment"},
     *      summary="Checkout",
     *      operationId="payment_checkout",
     *
     *      @OA\Parameter(
     *          name="module",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function checkout(CheckoutRequest $request, string $module)
    {
        abort_if(PaymentManager::hasModule($module) === false, 404, __('Payment module not found!'));

        $handler = PaymentManager::module($module);

        try {
            $order = DB::transaction(function () use ($handler, $request) {
                return $handler->createOrder($request->all());
            });
        } catch (\Exception $e) {
            return $this->restFail($e->getMessage());
        }

        $method = PaymentMethod::where('driver', $request->get('method'))
            ->where('active', true)
            ->first();

        if (! $method) {
            return $this->restFail(__('Payment method not found!'));
        }

        return $this->restSuccess([
            'order_id' => $order->id,
            'order_code' => $order->getCode(),
            'payment_method' => $method->driver,
            'amount' => $order->getTotalAmount(),
            'currency' => $order->getCurrency(),
        ]);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/payment/{module}/purchase",
     *      tags={"Payment"},
     *      summary="Purchase",
     *      operationId="payment_purchase",
     *
     *      @OA\Parameter(
     *          name="module",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function purchase(PaymentRequest $request, string $module)
    {
        abort_if(PaymentManager::hasModule($module) === false, 404, __('Payment module not found!'));

        $user = $request->currentActor();
        $method = PaymentMethod::where('driver', $request->get('method'))
            ->where('active', true)
            ->first();

        try {
            $payment = DB::transaction(
                function () use ($module, $request, $user, $method) {
                    return PaymentManager::create(
                        $user,
                        $module,
                        $method,
                        $request->post('order_id'),
                        $request->all()
                    );
                }
            );
        } catch (PaymentException $e) {
            return $this->restFail($e->getMessage());
        }

        if ($payment->isSuccessful()) {
            return $this->restSuccess([], __('Payment successful!'));
        }

        if ($payment->isRedirect()) {
            if ($method->paymentDriver()->isReturnInEmbed()) {
                return $this->restSuccess(
                    [
                        'type' => 'embed',
                        'embed_url' => $payment->getRedirectUrl(),
                        'payment_history_id' => $payment->getPaymentHistory()->id,
                        'order_id' => $payment->getPaymentHistory()->paymentable_id,
                    ]
                );
            }

            return $this->restSuccess(
                [
                    'type' => 'redirect',
                    'redirect' => $payment->getRedirectUrl(),
                ],
                __('Redirecting to payment gateway...')
            );
        }

        return $this->failResponse();
    }

    /**
     * @OA\Post(
     *      path="/api/v1/payment/{module}/return/{paymentHistoryId}",
     *      tags={"Payment"},
     *      summary="Return URL for payment gateway",
     *      operationId="payment_return",
     *
     *      @OA\Parameter(
     *          name="module",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Parameter(
     *          name="paymentHistoryId",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function return(Request $request, string $module, string $paymentHistoryId)
    {
        $paymentModule = PaymentManager::module($module);
        $returnUrl = $paymentModule->getReturnUrl();

        try {
            $payment = DB::transaction(
                function () use ($request, $module, $paymentHistoryId, &$returnUrl) {
                    $paymentHistory = PaymentHistory::lockForUpdate()->find($paymentHistoryId);

                    throw_if($paymentHistory == null, new PaymentException(__('Payment transaction not found!')));

                    throw_if($paymentHistory->status !== PaymentHistoryStatus::PROCESSING, new PaymentException(__('Transaction has been processed!')));

                    $gateway = $paymentHistory->paymentMethod->paymentDriver();

                    if ($gateway->isReturnInEmbed()) {
                        $returnUrl = route('payment.embed', [$module, $paymentHistoryId]);
                    }

                    return PaymentManager::complete($module, $paymentHistory, $request->all());
                }
            );
        } catch (PaymentException $e) {
            return $this->restFail(
                $e->getMessage(),
                422,
                ['redirect' => $returnUrl]
            );
        }

        if ($payment->isSuccessful()) {
            return $this->restSuccess(
                ['redirect' => $returnUrl],
                __('Payment completed successfully!')
            );
        }

        return $this->failResponse($returnUrl);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/payment/{module}/cancel/{transactionId}",
     *      tags={"Payment"},
     *      summary="Cancel URL for payment gateway",
     *      operationId="payment_cancel",
     *
     *      @OA\Parameter(
     *          name="module",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Parameter(
     *          name="transactionId",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function cancel(Request $request, string $module, string $transactionId)
    {
        $paymentModule = PaymentManager::module($module);
        $returnUrl = $paymentModule->getReturnUrl();

        try {
            $payment = DB::transaction(
                function () use ($transactionId, $module, $request) {
                    $paymentHistory = PaymentHistory::lockForUpdate()->find($transactionId);

                    throw_if($paymentHistory == null, new PaymentException(__('Payment transaction not found!')));

                    return PaymentManager::cancel($module, $paymentHistory, $request->all());
                }
            );
        } catch (PaymentException $e) {
            return $this->restFail(
                $e->getMessage(),
                422,
                ['redirect' => $returnUrl]
            );
        }

        return $this->restFail(
            __('Payment has been cancelled!'),
            400,
            ['redirect' => $returnUrl]
        );
    }

    /**
     * @OA\Post(
     *      path="/payment/{module}/webhook/{driver}",
     *      tags={"Payment"},
     *      summary="Webhook for payment gateway",
     *      operationId="payment_webhook",
     *
     *      @OA\Parameter(
     *          name="module",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Parameter(
     *          name="driver",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function webhook(Request $request, string $module, string $driver)
    {
        $handler = PaymentManager::module($module);
        $paymentMethod = PaymentMethod::where('driver', $driver)
            ->where('active', true)
            ->first();

        if ($paymentMethod == null) {
            Log::error(
                'Payment method not found',
                [
                    'module' => $module,
                    'driver' => $driver,
                    'request' => $request->all(),
                ]
            );

            return response(
                [
                    'message' => __('Payment method not found!'),
                    'success' => false,
                ]
            );
        }

        $gateway = $paymentMethod->paymentDriver();

        $response = $gateway->handleWebhook($request);

        if ($response === null) {
            return response(['success' => true]);
        }

        try {
            $payment = DB::transaction(
                function () use ($request, $handler, $module, $response) {
                    $paymentHistory = PaymentHistory::lockForUpdate()
                        ->where(['payment_id' => $response->getTransactionId(), 'module' => $module])
                        ->first();

                    throw_if($paymentHistory == null, new PaymentException(__('Payment transaction not found!')));

                    throw_if($paymentHistory->status !== PaymentHistoryStatus::PROCESSING, new PaymentException(__('Transaction has been processed!')));

                    if ($response->isSuccessful()) {
                        $handler->success($paymentHistory->paymentable, $request->all());

                        $paymentHistory->update(
                            [
                                'status' => PaymentHistoryStatus::SUCCESS,
                            ]
                        );

                        event(new PaymentSuccess($paymentHistory->paymentable, $request->all()));
                    } else {
                        $handler->fail($paymentHistory->paymentable, $request->all());

                        $paymentHistory->update(
                            [
                                'status' => PaymentHistoryStatus::FAILED,
                            ]
                        );

                        event(new PaymentFail($paymentHistory->paymentable, $request->all()));
                    }

                    return $paymentHistory;
                }
            );
        } catch (PaymentException $e) {
            report($e);

            return response(
                [
                    'message' => $e->getMessage(),
                    'success' => false,
                ]
            );
        }

        return response(['success' => true]);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/payment/{module}/status/{transactionId}",
     *      tags={"Payment"},
     *      summary="Get payment status",
     *      operationId="payment_status",
     *
     *      @OA\Parameter(
     *          name="module",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Parameter(
     *          name="transactionId",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function status(string $module, string $transactionId)
    {
        $paymentHistory = PaymentHistory::find($transactionId);

        throw_if($paymentHistory == null, new PaymentException(__('Payment transaction not found!')));

        $paymentHistory->load(['paymentable']);

        return $this->restSuccess(
            [
                'status' => $paymentHistory->status->value,
            ]
        );
    }

    protected function failResponse(?string $redirectUrl = null)
    {
        if ($redirectUrl) {
            return $this->restFail(
                __('Payment failed!'),
                422,
                ['redirect' => $redirectUrl]
            );
        }

        return $this->restFail(
            __('Sorry, there was an error processing your payment. Please try again later.')
        );
    }
}
