<?php

namespace Juzaweb\Modules\API\Http\Controllers\App;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\API\Http\Resources\App\MenuResource;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Models\Menus\Menu;
use OpenApi\Annotations as OA;

class MenuController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/app/menus/{id}",
     *      tags={"App/Menus"},
     *      summary="Get menu details by id for the frontend app",
     *
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="The menu id",
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
     *              @OA\Property(property="data", ref="#/components/schemas/AppMenuResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Menu not found")
     * )
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $locale = $request->input('locale', app()->getLocale());

        $menu = Menu::withDataItems($locale)->findOrFail($id);

        return $this->restSuccess((new MenuResource($menu))->toArray($request));
    }
}
