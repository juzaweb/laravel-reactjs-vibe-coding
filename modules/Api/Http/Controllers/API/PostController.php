<?php

namespace Juzaweb\Modules\Api\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Api\Http\Requests\PostRequest;
use Juzaweb\Modules\Api\Http\Resources\PostResource;
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
        $keyword = $request->input('keyword');

        $query = Post::query();

        if ($keyword) {
            $query->search($keyword);
        }

        $posts = $query->paginate($limit);

        return $this->restSuccess(PostResource::collection($posts));
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
                $data = $request->validated();
                $post = new Post;
                $post->fill($data);
                $post->save();

                return $post;
            }
        );

        return $this->restSuccess(new PostResource($post));
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
        $post = Post::findOrFail($id);

        return $this->restSuccess(new PostResource($post));
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

        $post = DB::transaction(
            function () use ($post, $request) {
                $post->update($request->validated());

                return $post;
            }
        );

        return $this->restSuccess(new PostResource($post));
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
}
