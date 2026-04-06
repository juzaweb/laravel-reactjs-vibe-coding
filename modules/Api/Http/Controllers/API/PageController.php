<?php

namespace Juzaweb\Modules\Api\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Api\Http\Requests\PageRequest;
use Juzaweb\Modules\Api\Http\Resources\PageResource;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Models\Pages\Page;
use OpenApi\Annotations as OA;

class PageController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/pages",
     *      tags={"Pages"},
     *      summary="Get list of pages",
     *      @OA\Parameter(ref="#/components/parameters/query_limit"),
     *      @OA\Parameter(ref="#/components/parameters/query_page"),
     *      @OA\Parameter(ref="#/components/parameters/query_keyword"),
     *      @OA\Response(response=200, description="Successful operation", @OA\JsonContent(ref="#/components/schemas/success_paging")),
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $this->getLimitRequest();
        $keyword = $request->input('keyword');

        $query = Page::query()->withTranslation();

        if ($keyword) {
            $query->additionSearch($keyword);
        }

        $pages = $query->paginate($limit);

        return $this->restSuccess(PageResource::collection($pages));
    }
    /**
     * @OA\Post(
     *      path="/api/v1/pages",
     *      tags={"Pages"},
     *      summary="Create a new page",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"title", "locale", "status"},
     *              @OA\Property(property="locale", type="string", example="en"),
     *              @OA\Property(property="status", type="string", example="published"),
     *              @OA\Property(property="title", type="string", example="New Page"),
     *              @OA\Property(property="slug", type="string", example="new-page"),
     *              @OA\Property(property="content", type="string", example="Page content"),
     *              @OA\Property(property="template", type="string", example="default"),
     *              @OA\Property(property="thumbnail", type="string", example="")
     *          )
     *      ),
     *      @OA\Response(response=200, description="Successful operation", @OA\JsonContent(ref="#/components/schemas/PageResource")),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(PageRequest $request): JsonResponse
    {
        $page = DB::transaction(function () use ($request) {
            $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
            $data = $request->validated();

            $page = new Page($data);
            $page->setDefaultLocale($locale);
            $page->save();

            return $page;
        });

        return $this->restSuccess(new PageResource($page));
    }

    /**
     * @OA\Get(
     *      path="/api/v1/pages/{slug}",
     *      tags={"Pages"},
     *      summary="Get page details by slug",
     *
     *      @OA\Parameter(
     *          name="slug",
     *          in="path",
     *          required=true,
     *
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\Response(response=200, description="Successful operation", @OA\JsonContent(ref="#/components/schemas/PageResource")),
     *      @OA\Response(response=404, description="Page not found")
     * )
     */
    public function show(string $slug): JsonResponse
    {
        $page = Page::whereTranslation('slug', $slug)->firstOrFail();

        return $this->restSuccess(new PageResource($page));
    }

    /**
     * @OA\Put(
     *      path="/api/v1/pages/{id}",
     *      tags={"Pages"},
     *      summary="Update an existing page",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          @OA\Schema(type="string")
     *      ),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"title", "locale", "status"},
     *              @OA\Property(property="locale", type="string", example="en"),
     *              @OA\Property(property="status", type="string", example="published"),
     *              @OA\Property(property="title", type="string", example="Updated Page"),
     *              @OA\Property(property="slug", type="string", example="updated-page"),
     *              @OA\Property(property="content", type="string", example="Updated content"),
     *              @OA\Property(property="template", type="string", example="default"),
     *              @OA\Property(property="thumbnail", type="string", example="")
     *          )
     *      ),
     *      @OA\Response(response=200, description="Successful operation", @OA\JsonContent(ref="#/components/schemas/PageResource")),
     *      @OA\Response(response=404, description="Page not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(PageRequest $request, string $id): JsonResponse
    {
        $page = Page::findOrFail($id);
        $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
        $page->setDefaultLocale($locale);

        $page = DB::transaction(function () use ($page, $request) {
            $page->update($request->validated());
            return $page;
        });

        return $this->restSuccess(new PageResource($page));
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/pages/{id}",
     *      tags={"Pages"},
     *      summary="Delete a page",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          @OA\Schema(type="string")
     *      ),
     *      @OA\Response(response=200, description="Successful operation", @OA\JsonContent(ref="#/components/schemas/success_detail")),
     *      @OA\Response(response=404, description="Page not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $page = Page::findOrFail($id);
        $page->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }
}