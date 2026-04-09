<?php

namespace Juzaweb\Modules\AdsManagement\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\AdsManagement\Http\Requests\BannerAdRequest;
use Juzaweb\Modules\AdsManagement\Models\BannerAds;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Http\Requests\BulkActionsRequest;
use OpenApi\Annotations as OA;

class BannerAdsController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/banner-ads",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Banner Ads"},
     *      summary="Get list of banner ads",
     *
     *      @OA\Parameter(ref="#/components/parameters/query_limit"),
     *      @OA\Parameter(ref="#/components/parameters/query_page"),
     *      @OA\Parameter(ref="#/components/parameters/query_keyword"),
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
        $query = BannerAds::query();

        if ($request->has('keyword')) {
            $query->where('name', 'like', '%'.$request->input('keyword').'%');
        }

        $items = $query->paginate($limit);

        return $this->restSuccess($items);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/banner-ads",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Banner Ads"},
     *      summary="Create a new banner ad",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/BannerAdRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/BannerAdsResource"))
     *      ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(BannerAdRequest $request): JsonResponse
    {
        $model = DB::transaction(
            function () use ($request) {
                $data = $request->validated();
                if ($data['type'] === 'html') {
                    $data['body'] = $data['body_html'];
                } else {
                    $data['body'] = $data['body_image'];
                }
                unset($data['body_html'], $data['body_image']);

                $banner = BannerAds::create($data);

                $banner->positions()->create([
                    'position' => $data['position'],
                ]);

                return $banner;
            }
        );

        return $this->restSuccess($model);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/banner-ads/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Banner Ads"},
     *      summary="Get banner ad details by id",
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
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="data", ref="#/components/schemas/BannerAdsResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Banner Ad not found")
     * )
     */
    public function show(string $id): JsonResponse
    {
        $model = BannerAds::findOrFail($id);

        return $this->restSuccess($model);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/banner-ads/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Banner Ads"},
     *      summary="Update an existing banner ad",
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
     *          @OA\JsonContent(ref="#/components/schemas/BannerAdRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/BannerAdsResource"))
     *       ),
     *
     *      @OA\Response(response=404, description="Banner Ad not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(BannerAdRequest $request, string $id): JsonResponse
    {
        $model = BannerAds::findOrFail($id);

        $model = DB::transaction(
            function () use ($request, $model) {
                $data = $request->validated();
                if ($data['type'] === 'html') {
                    $data['body'] = $data['body_html'];
                } else {
                    $data['body'] = $data['body_image'];
                }
                unset($data['body_html'], $data['body_image']);

                $model->update($data);

                $model->positions()->delete();
                $model->positions()->create([
                    'position' => $data['position'],
                ]);

                return $model;
            }
        );

        return $this->restSuccess($model);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/banner-ads/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Banner Ads"},
     *      summary="Delete a banner ad",
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
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="message", type="string", example="Deleted successfully"),
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Banner Ad not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $model = BannerAds::findOrFail($id);
        $model->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/api/v1/banner-ads/bulk",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Banner Ads"},
     *      summary="Bulk action on banner ads",
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
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="message", type="string", example="Bulk action successfully")
     *          )
     *      )
     * )
     */
    public function bulk(BulkActionsRequest $request): JsonResponse
    {
        $action = $request->input('action');
        $ids = $request->input('ids', []);

        switch ($action) {
            case 'delete':
                BannerAds::whereIn('id', $ids)->get()->each->delete();
                break;
            case 'activate':
                BannerAds::whereIn('id', $ids)->get()->each->update(['active' => true]);
                break;
            case 'deactivate':
                BannerAds::whereIn('id', $ids)->get()->each->update(['active' => false]);
                break;
        }

        return $this->restSuccess([], 'Bulk action successfully');
    }
}
