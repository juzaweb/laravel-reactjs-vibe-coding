<?php

namespace Juzaweb\Modules\Payment\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Payment\Models\PaymentHistory;
use OpenApi\Annotations as OA;

class PaymentHistoryController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/payment-histories",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Payment"},
     *      summary="Get list of payment histories",
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

        $query = PaymentHistory::query();

        // If the user does not have permission to view all, scope it to their own records
        if (! $request->user()->hasPermissionTo('payment_histories.index')) {
            $query->where('payer_id', $request->user()->id)
                ->where('payer_type', get_class($request->user()));
        }

        $query->api($request->all());

        $histories = $query->paginate($limit);

        return $this->restSuccess($histories);
    }
}
