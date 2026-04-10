<?php

namespace Juzaweb\Modules\AdsManagement\Http\Controllers\App;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\AdsManagement\Models\BannerAds;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use OpenApi\Annotations as OA;

class BannerAdsController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/app/banner-ads",
     *      tags={"App / Banner Ads"},
     *      summary="Get list of banner ads by position",
     *
     *      @OA\Parameter(
     *          name="position",
     *          in="query",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Parameter(ref="#/components/parameters/query_limit"),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/BannerAdsResource")),
     *              @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
     *              @OA\Property(property="links", ref="#/components/schemas/PaginationLinks"),
     *              @OA\Property(property="success", type="boolean", example=true),
     *          )
     *      ),
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $this->getLimitRequest();
        $position = $request->input('position');

        $query = BannerAds::query()
            ->whereFrontend();

        if ($position) {
            $query->wherePosition($position);
        }

        $items = $query->paginate($limit);

        return $this->restSuccess($items);
    }
}
