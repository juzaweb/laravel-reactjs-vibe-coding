<?php

namespace Juzaweb\Modules\Subscription\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Subscription\Facades\Subscription;
use OpenApi\Annotations as OA;

class FeatureController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/subscription/features",
     *      tags={"Subscription"},
     *      summary="Get list of subscription features",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *              type="object",
     *
     *              @OA\Property(
     *                  property="data",
     *                  type="array",
     *
     *                  @OA\Items(
     *                      type="object",
     *
     *                      @OA\Property(property="name", type="string", example="domain"),
     *                      @OA\Property(property="label", type="string", example="Custom Domain"),
     *                      @OA\Property(property="type", type="string", example="boolean"),
     *                      @OA\Property(property="description", type="string", nullable=true, example="Allow custom domain")
     *                  )
     *              )
     *          )
     *      ),
     *
     *      @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $features = Subscription::features();

        return $this->restSuccess($features);
    }
}
