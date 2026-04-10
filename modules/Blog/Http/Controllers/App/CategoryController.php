<?php

namespace Juzaweb\Modules\Blog\Http\Controllers\App;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Blog\Http\Resources\CategoryResource;
use Juzaweb\Modules\Blog\Models\Category;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use OpenApi\Annotations as OA;

class CategoryController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/app/categories/{slug}",
     *      tags={"App/Blog/Categories"},
     *      summary="Get category details by slug",
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
     *              @OA\Property(property="data", ref="#/components/schemas/CategoryResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Category not found")
     * )
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $locale = $request->input('locale');

        $category = Category::query()
            ->withTranslation($locale)
            ->where('slug', $slug)
            ->firstOrFail();

        return $this->restSuccess((new CategoryResource($category))->toArray($request));
    }
}
