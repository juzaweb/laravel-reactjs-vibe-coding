<?php

namespace Juzaweb\Modules\Api\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Api\Http\Requests\MenuRequest;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Models\Menus\Menu;
use OpenApi\Annotations as OA;

class MenuController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/menus",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Menus"},
     *      summary="Get list of menus",
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
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/MenuResource")),
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

        $query = Menu::query()->api($request->all());

        $menus = $query->paginate($limit);

        return $this->restSuccess($menus);
    }

    /**
     * @OA\Post(
     *      path="/api/v1/menus",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Menus"},
     *      summary="Create a new menu",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(ref="#/components/schemas/MenuRequest")
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/MenuResource"))
     *      ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(MenuRequest $request): JsonResponse
    {
        $menu = Menu::create($request->validated());

        return $this->restSuccess($menu);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/menus/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Menus"},
     *      summary="Get menu details by id",
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
     *              @OA\Property(property="data", ref="#/components/schemas/MenuResource"),
     *              @OA\Property(property="success", type="boolean", example=true)
     *          )
     *      ),
     *
     *      @OA\Response(response=404, description="Menu not found")
     * )
     */
    public function show(string $id): JsonResponse
    {
        $menu = Menu::findOrFail($id);

        return $this->restSuccess($menu);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/menus/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Menus"},
     *      summary="Update an existing menu",
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
     *          @OA\JsonContent(ref="#/components/schemas/MenuRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/MenuResource"))
     *       ),
     *
     *      @OA\Response(response=404, description="Menu not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(MenuRequest $request, string $id): JsonResponse
    {
        $menu = Menu::findOrFail($id);
        $menu->update($request->validated());

        return $this->restSuccess($menu);
    }

    /**
     * @OA\Delete(
     *      path="/api/v1/menus/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Menus"},
     *      summary="Delete a menu",
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
     *      @OA\Response(response=404, description="Menu not found")
     * )
     */
    public function destroy(string $id): JsonResponse
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();

        return $this->restSuccess([], 'Deleted successfully');
    }
}
