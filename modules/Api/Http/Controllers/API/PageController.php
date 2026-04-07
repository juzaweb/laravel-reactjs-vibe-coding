<?php

namespace Juzaweb\Modules\Api\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Api\Http\Requests\PageBulkRequest;
use Juzaweb\Modules\Api\Http\Requests\PageRequest;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Models\Pages\Page;
use OpenApi\Annotations as OA;

class PageController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/pages",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Pages"},
     *      summary="Get list of pages",
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
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/PageResource")),
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

        $query = Page::query()->withTranslation($locale)->api($request->all());

        $pages = $query->paginate($limit);

        return $this->restSuccess($pages);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/pages",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Pages"},
     *      summary="Create a new page",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/PageRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/PageResource"))
     *      ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(PageRequest $request): JsonResponse
    {
        $page = DB::transaction(
            function () use ($request) {
                $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
                $data = $request->validated();

                $page = new Page;
                $page->setDefaultLocale($locale);
                $page->fill($data);
                $page->save();

                return $page;
            }
        );

        return $this->restSuccess($page);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/pages/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Pages"},
     *      summary="Get page details by id",
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
     *              @OA\Property(property="data", ref="#/components/schemas/PageResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Page not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $locale = $request->input('locale');
        $page = Page::withTranslation($locale)->findOrFail($id);

        return $this->restSuccess($page);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/pages/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Pages"},
     *      summary="Update an existing page",
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
     *          @OA\JsonContent(ref="#/components/schemas/PageRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/PageResource"))
     *       ),
     *
     *      @OA\Response(response=404, description="Page not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(PageRequest $request, string $id): JsonResponse
    {
        $page = Page::findOrFail($id);
        $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
        $page->setDefaultLocale($locale);

        $page = DB::transaction(
            function () use ($page, $request) {
                $page->update($request->validated());

                return $page;
            }
        );

        return $this->restSuccess($page);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/pages/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Pages"},
     *      summary="Delete a page",
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
     *      @OA\Response(response=404, description="Page not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $page = Page::findOrFail($id);
        $page->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/api/v1/pages/bulk",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Pages"},
     *      summary="Bulk action on pages",
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
    public function bulk(PageBulkRequest $request): JsonResponse
    {
        $ids = $request->input('ids');
        $action = $request->input('action');

        if ($action === 'delete') {
            Page::whereIn('id', $ids)->delete();
        } else {
            Page::whereIn('id', $ids)->update(['status' => $action]);
        }

        return $this->restSuccess([], 'Bulk action successfully');
    }
}
