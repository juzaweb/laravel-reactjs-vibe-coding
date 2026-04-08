<?php

namespace Juzaweb\Modules\Blog\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Blog\Http\Requests\PostBulkRequest;
use Juzaweb\Modules\Blog\Http\Requests\PostRequest;
use Juzaweb\Modules\Blog\Http\Resources\PostResource;
use Juzaweb\Modules\Blog\Models\Post;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use OpenApi\Annotations as OA;

class PostController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/posts",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Posts"},
     *      summary="Get list of posts",
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
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/PostResource")),
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
        $locale = $request->input('locale');

        $query = Post::query()->withTranslation($locale);

        $query->api($request->all());

        $posts = $query->paginate($limit);

        return $this->restSuccess($posts);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/posts",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Posts"},
     *      summary="Create a new post",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/PostRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/PostResource"))
     *      ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(PostRequest $request): JsonResponse
    {
        $post = DB::transaction(
            function () use ($request) {
                $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
                $data = $request->validated();

                $post = new Post;
                $post->setDefaultLocale($locale);
                $post->fill($data);
                $post->save();

                return $post;
            }
        );

        return $this->restSuccess($post);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/posts/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Posts"},
     *      summary="Get post details by id",
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
     *              @OA\Property(property="data", ref="#/components/schemas/PostResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Post not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $locale = $request->input('locale');
        $post = Post::withTranslation($locale)->findOrFail($id);

        return $this->restSuccess($post);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/posts/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Posts"},
     *      summary="Update an existing post",
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
     *          @OA\JsonContent(ref="#/components/schemas/PostRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/PostResource"))
     *       ),
     *
     *      @OA\Response(response=404, description="Post not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(PostRequest $request, string $id): JsonResponse
    {
        $post = Post::findOrFail($id);
        $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
        $post->setDefaultLocale($locale);

        $post = DB::transaction(
            function () use ($post, $request) {
                $post->update($request->validated());

                return $post;
            }
        );

        return $this->restSuccess($post);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/posts/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Posts"},
     *      summary="Delete a post",
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
     *      @OA\Response(response=404, description="Post not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $post = Post::findOrFail($id);
        $post->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/api/v1/posts/bulk",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Posts"},
     *      summary="Bulk action on posts",
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
    public function bulk(PostBulkRequest $request): JsonResponse
    {
        $ids = $request->input('ids');
        $action = $request->input('action');

        if ($action === 'delete') {
            Post::whereIn('id', $ids)->delete();
        } else {
            Post::whereIn('id', $ids)->update(['status' => $action]);
        }

        return $this->restSuccess([], 'Bulk action successfully');
    }
}
