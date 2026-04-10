<?php

namespace Juzaweb\Modules\API\Http\Controllers\App;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\API\Http\Resources\PageResource;
use Juzaweb\Modules\Core\Enums\PageStatus;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Models\Pages\Page;
use OpenApi\Annotations as OA;

class PageController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/app/pages/{slug}",
     *      tags={"App/Pages"},
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
     *              @OA\Property(property="data", ref="#/components/schemas/PageResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Page not found")
     * )
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $locale = $request->input('locale');

        $page = Page::query()
            ->withTranslation($locale)
            ->where('slug', $slug)
            ->where('status', PageStatus::PUBLISHED)
            ->firstOrFail();

        return $this->restSuccess((new PageResource($page))->toArray($request));
    }
}
