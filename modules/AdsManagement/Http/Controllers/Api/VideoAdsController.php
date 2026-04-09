<?php

namespace Juzaweb\Modules\AdsManagement\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\AdsManagement\Http\Requests\VideoAdsRequest;
use Juzaweb\Modules\AdsManagement\Models\VideoAds;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Http\Requests\BulkActionsRequest;
use OpenApi\Annotations as OA;

class VideoAdsController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/video-ads",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Video Ads"},
     *      summary="Get list of video ads",
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
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/VideoAdsResource")),
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
        $query = VideoAds::query();

        if ($request->has('keyword')) {
            $query->where('name', 'like', '%' . $request->input('keyword') . '%');
        }

        $items = $query->paginate($limit);

        return $this->restSuccess($items);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/video-ads",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Video Ads"},
     *      summary="Create a new video ad",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/VideoAdsRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/VideoAdsResource"))
     *      ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(VideoAdsRequest $request): JsonResponse
    {
        $model = DB::transaction(
            function () use ($request) {
                $data = $request->validated();
                return VideoAds::create($data);
            }
        );

        return $this->restSuccess($model);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/video-ads/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Video Ads"},
     *      summary="Get video ad details by id",
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
     *              @OA\Property(property="data", ref="#/components/schemas/VideoAdsResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Video Ad not found")
     * )
     */
    public function show(string $id): JsonResponse
    {
        $model = VideoAds::findOrFail($id);

        return $this->restSuccess($model);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/video-ads/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Video Ads"},
     *      summary="Update an existing video ad",
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
     *          @OA\JsonContent(ref="#/components/schemas/VideoAdsRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/VideoAdsResource"))
     *       ),
     *
     *      @OA\Response(response=404, description="Video Ad not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(VideoAdsRequest $request, string $id): JsonResponse
    {
        $model = VideoAds::findOrFail($id);

        $model = DB::transaction(
            function () use ($request, $model) {
                $data = $request->validated();
                $model->update($data);
                return $model;
            }
        );

        return $this->restSuccess($model);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/video-ads/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Video Ads"},
     *      summary="Delete a video ad",
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
     *              @OA\Property(property="message", type="string", example="Deleted successfully"),
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Video Ad not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $model = VideoAds::findOrFail($id);
        $model->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/api/v1/video-ads/bulk",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Video Ads"},
     *      summary="Bulk action on video ads",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
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
     *              @OA\Property(property="message", type="string", example="Bulk action successfully")
     *          )
     *      )
     * )
     */
    public function bulk(BulkActionsRequest $request): JsonResponse
    {
        $action = $request->input('action');
        $ids = $request->input('ids', []);

        $models = VideoAds::whereIn('id', $ids)->get();

        foreach ($models as $model) {
            if ($action === 'activate') {
                $model->update(['active' => true]);
            } elseif ($action === 'deactivate') {
                $model->update(['active' => false]);
            } elseif ($action === 'delete') {
                $model->delete();
            }
        }

        return $this->restSuccess([], 'Bulk action successfully');
    }
}
