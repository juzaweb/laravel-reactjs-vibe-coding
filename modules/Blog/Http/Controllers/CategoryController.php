<?php

namespace Juzaweb\Modules\Blog\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Blog\Http\Requests\CategoryBulkRequest;
use Juzaweb\Modules\Blog\Http\Requests\CategoryRequest;
use Juzaweb\Modules\Blog\Models\Category;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use OpenApi\Annotations as OA;

class CategoryController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/categories",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Categories"},
     *      summary="Get list of categories",
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
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/CategoryResource")),
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

        $query = Category::query()->withTranslation($locale);

        $query->api($request->all());

        $categories = $query->paginate($limit);

        return $this->restSuccess($categories);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/categories",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Categories"},
     *      summary="Create a new category",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/CategoryRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/CategoryResource"))
     *      ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(CategoryRequest $request): JsonResponse
    {
        $category = DB::transaction(
            function () use ($request) {
                $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
                $data = $request->validated();

                $category = new Category;
                $category->setDefaultLocale($locale);
                $category->fill($data);
                $category->save();

                return $category;
            }
        );

        return $this->restSuccess($category);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/categories/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Categories"},
     *      summary="Get category details by id",
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
     *              @OA\Property(property="data", ref="#/components/schemas/CategoryResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Category not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $locale = $request->input('locale');
        $category = Category::withTranslation($locale)->findOrFail($id);

        return $this->restSuccess($category);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/categories/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Categories"},
     *      summary="Update an existing category",
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
     *          @OA\JsonContent(ref="#/components/schemas/CategoryRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/CategoryResource"))
     *       ),
     *
     *      @OA\Response(response=404, description="Category not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(CategoryRequest $request, string $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $locale = $request->input('locale', config('translatable.fallback_locale', 'en'));
        $category->setDefaultLocale($locale);

        $category = DB::transaction(
            function () use ($category, $request) {
                $category->update($request->validated());

                return $category;
            }
        );

        return $this->restSuccess($category);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/categories/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Categories"},
     *      summary="Delete a category",
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
     *      @OA\Response(response=404, description="Category not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }

    /**
     * @OA\Post(
     *      path="/api/v1/categories/bulk",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Categories"},
     *      summary="Bulk action on categories",
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
    public function bulk(CategoryBulkRequest $request): JsonResponse
    {
        $ids = $request->input('ids');
        $action = $request->input('action');

        if ($action === 'delete') {
            Category::whereIn('id', $ids)->delete();
        }

        return $this->restSuccess([], 'Bulk action successfully');
    }
}
