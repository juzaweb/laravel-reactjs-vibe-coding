<?php

namespace Juzaweb\Modules\Api\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Api\Http\Requests\MediaBulkRequest;
use Juzaweb\Modules\Api\Http\Requests\MediaRequest;
use Juzaweb\Modules\Core\Contracts\Media as MediaContract;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Models\Media;
use OpenApi\Annotations as OA;

class MediaController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/media",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Media"},
     *      summary="Get list of media files",
     *
     *      @OA\Parameter(ref="#/components/parameters/query_limit"),
     *      @OA\Parameter(ref="#/components/parameters/query_page"),
     *      @OA\Parameter(ref="#/components/parameters/query_keyword"),
     *      @OA\Parameter(
     *          name="folder_id",
     *          in="query",
     *          required=false,
     *
     *          @OA\Schema(type="integer")
     *      ),
     *
     *      @OA\Parameter(
     *          name="type",
     *          in="query",
     *          required=false,
     *
     *          @OA\Schema(type="string", enum={"image", "video", "audio", "document", "file"})
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/MediaResource")),
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
        $folderId = $request->input('folder_id');
        $type = $request->input('type');

        $query = Media::query();

        $query->api($request->all());

        if ($folderId !== null) {
            $query->where('folder_id', $folderId);
        }

        if ($type) {
            $query->where('type', $type);
        }

        $media = $query->paginate($limit);

        return $this->restSuccess($media);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/media",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Media"},
     *      summary="Upload a new media file",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\MediaType(
     *              mediaType="multipart/form-data",
     *
     *              @OA\Schema(ref="#/components/schemas/MediaRequest")
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/MediaResource"))
     *      ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(MediaRequest $request): JsonResponse
    {
        $media = DB::transaction(
            function () use ($request) {
                $file = $request->file('file');
                $folderId = $request->input('folder_id');

                return app(MediaContract::class)->upload($file, $folderId);
            }
        );

        return $this->restSuccess($media);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/media/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Media"},
     *      summary="Get media details by id",
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
     *              @OA\Property(property="data", ref="#/components/schemas/MediaResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Media not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $media = Media::findOrFail($id);

        return $this->restSuccess($media);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/media/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Media"},
     *      summary="Update media info (name, etc)",
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
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="name", type="string"),
     *              @OA\Property(property="folder_id", type="integer")
     *          )
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/MediaResource"))
     *       ),
     *
     *      @OA\Response(response=404, description="Media not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'folder_id' => 'nullable|integer',
        ]);

        $media = Media::findOrFail($id);

        $media = DB::transaction(
            function () use ($media, $request) {
                $media->update($request->only(['name', 'folder_id']));

                return $media;
            }
        );

        return $this->restSuccess($media);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/media/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Media"},
     *      summary="Delete a media file",
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
     *
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Media not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        $media->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/api/v1/media/bulk",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Media"},
     *      summary="Bulk action on media files",
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
     *
     *              @OA\Property(property="message", type="string", example="Bulk action successfully")
     *          )
     *      )
     * )
     */
    public function bulk(MediaBulkRequest $request): JsonResponse
    {
        $ids = $request->input('ids');
        $action = $request->input('action');

        if ($action === 'delete') {
            Media::whereIn('id', $ids)->delete();
        }

        return $this->restSuccess([], 'Bulk action successfully');
    }
}
