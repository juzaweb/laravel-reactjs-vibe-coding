<?php

namespace Juzaweb\Modules\Subscription\Http\Controllers\App;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Subscription\Models\Plan;
use OpenApi\Annotations as OA;

class PlanController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/app/subscription/plans",
     *      tags={"Subscription"},
     *      summary="Get active plans",
     *      description="Returns active plans for app.",
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *              type="object",
     *
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/PlanResource"))
     *          )
     *      )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Plan::with(['features'])
            ->where('active', true);

        $plans = $query->paginate($this->getLimitRequest());

        return $this->restSuccess($plans);
    }
}
