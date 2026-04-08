<?php

namespace Juzaweb\Modules\Payment\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Payment\Facades\PaymentManager;
use Juzaweb\Modules\Payment\Http\Requests\PaymentMethodRequest;
use Juzaweb\Modules\Payment\Models\PaymentMethod;
use OpenApi\Annotations as OA;

class PaymentMethodController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/payment-methods/drivers",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Payment Methods"},
     *      summary="Get list of payment drivers",
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     * )
     */
    public function drivers(): JsonResponse
    {
        $drivers = PaymentManager::drivers();
        $data = [];

        foreach ($drivers as $name => $label) {
            $data[] = [
                'name' => $name,
                'label' => $label,
                'configs' => PaymentManager::config($name),
            ];
        }

        return $this->restSuccess($data);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/payment-methods",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Payment Methods"},
     *      summary="Get list of payment methods",
     *
     *      @OA\Parameter(ref="#/components/parameters/query_limit"),
     *      @OA\Parameter(ref="#/components/parameters/query_page"),
     *      @OA\Parameter(ref="#/components/parameters/query_keyword"),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $this->getLimitRequest();
        $locale = $request->input('locale', app()->getLocale());

        $query = PaymentMethod::query();
        if ($locale) {
            $query->withTranslation($locale);
        }

        $query->api($request->all());

        $methods = $query->paginate($limit);

        return $this->restSuccess($methods);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/payment-methods",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Payment Methods"},
     *      summary="Create a new payment method",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/PaymentMethodRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(PaymentMethodRequest $request): JsonResponse
    {
        $method = DB::transaction(
            function () use ($request) {
                $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
                $data = $request->validated();

                $method = new PaymentMethod;
                $method->setDefaultLocale($locale);
                $method->fill($data);
                $method->save();

                return $method;
            }
        );

        return $this->restSuccess($method);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/payment-methods/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Payment Methods"},
     *      summary="Get payment method details by id",
     *
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     *      @OA\Response(response=404, description="Payment method not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $locale = $request->input('locale', app()->getLocale());
        $query = PaymentMethod::query();
        if ($locale) {
            $query->withTranslation($locale);
        }
        $method = $query->findOrFail($id);

        return $this->restSuccess($method);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/payment-methods/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Payment Methods"},
     *      summary="Update an existing payment method",
     *
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/PaymentMethodRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *       ),
     *      @OA\Response(response=404, description="Payment method not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(PaymentMethodRequest $request, string $id): JsonResponse
    {
        $method = PaymentMethod::findOrFail($id);
        $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
        $method->setDefaultLocale($locale);

        $method = DB::transaction(
            function () use ($method, $request) {
                $method->update($request->validated());

                return $method;
            }
        );

        return $this->restSuccess($method);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/payment-methods/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Payment Methods"},
     *      summary="Delete a payment method",
     *
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     *      @OA\Response(response=404, description="Payment method not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $method = PaymentMethod::findOrFail($id);
        $method->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/api/v1/payment-methods/bulk",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Payment Methods"},
     *      summary="Bulk action on payment methods",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="ids", type="array", @OA\Items(type="string")),
     *              @OA\Property(property="action", type="string")
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      )
     * )
     */
    public function bulk(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'action' => 'required|string|in:delete',
        ]);

        $ids = $request->input('ids');
        $action = $request->input('action');

        if ($action === 'delete') {
            PaymentMethod::whereIn('id', $ids)->delete();
        }

        return $this->restSuccess([], 'Bulk action successfully');
    }
}
