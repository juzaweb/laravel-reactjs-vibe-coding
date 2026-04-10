<?php

namespace Juzaweb\Modules\Blog\Http\Controllers\App;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Blog\Http\Resources\PostResource;
use Juzaweb\Modules\Blog\Models\Post;
use Juzaweb\Modules\Core\Enums\PostStatus;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use OpenApi\Annotations as OA;

class PostController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/app/posts",
     *      tags={"App/Blog/Posts"},
     *      summary="Get list of posts",
     *
     *      @OA\Parameter(ref="#/components/parameters/query_limit"),
     *      @OA\Parameter(ref="#/components/parameters/query_page"),
     *      @OA\Parameter(ref="#/components/parameters/query_keyword"),
     *      @OA\Parameter(
     *          name="locale",
     *          in="query",
     *          required=false,
     *          description="The locale code",
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Parameter(
     *          name="category",
     *          in="query",
     *          required=false,
     *          description="Category slug to filter by",
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
        $categorySlug = $request->input('category');
        $keyword = $request->input('keyword');

        $query = Post::query()
            ->withTranslation($locale)
            ->where('status', PostStatus::PUBLISHED);

        if ($categorySlug) {
            $query->whereHas('categories', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if ($keyword) {
            $query->whereHas('translations', function ($q) use ($keyword) {
                $q->where('title', 'like', '%'.$keyword.'%');
            });
        }

        $query->orderBy('created_at', 'desc');

        $posts = $query->paginate($limit);

        return $this->restSuccess(PostResource::collection($posts));
    }

    /**
     * @OA\Get(
     *      path="/api/v1/app/posts/{slug}",
     *      tags={"App/Blog/Posts"},
     *      summary="Get post details by slug",
     *
     *      @OA\Parameter(
     *          name="slug",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Parameter(
     *          name="locale",
     *          in="query",
     *          required=false,
     *          description="The locale code",
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
    public function show(Request $request, string $slug): JsonResponse
    {
        $locale = $request->input('locale');

        $post = Post::query()
            ->withTranslation($locale)
            ->where('slug', $slug)
            ->where('status', PostStatus::PUBLISHED)
            ->firstOrFail();

        return $this->restSuccess((new PostResource($post))->toArray($request));
    }
}
