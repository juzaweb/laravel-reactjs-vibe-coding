<?php

namespace Juzaweb\Modules\Api\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Api\Http\Requests\MenuRequest;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Models\Menus\Menu;
use Juzaweb\Modules\Core\Models\Menus\MenuItem;
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
        DB::beginTransaction();
        try {
            $menu = Menu::create($request->validated());

            if ($request->has('content')) {
                $this->syncMenuItems($menu, json_decode($request->input('content'), true) ?? []);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

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
        $menu = Menu::withDataItems(app()->getLocale())->findOrFail($id);

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
        DB::beginTransaction();
        try {
            $menu = Menu::findOrFail($id);
            $menu->update($request->validated());

            if ($request->has('content')) {
                $this->syncMenuItems($menu, json_decode($request->input('content'), true) ?? []);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $this->restSuccess($menu);
    }

    protected function syncMenuItems(Menu $menu, array $items): void
    {
        $existingItemIds = $menu->items()->pluck('id')->toArray();
        $processedItemIds = [];

        $this->processItems($menu, $items, null, $processedItemIds, $existingItemIds);

        $itemsToDelete = array_diff($existingItemIds, $processedItemIds);
        if (! empty($itemsToDelete)) {
            MenuItem::whereIn('id', $itemsToDelete)->delete();
        }
    }

    protected function processItems(Menu $menu, array $items, ?string $parentId, array &$processedItemIds, array $existingItemIds): void
    {
        foreach ($items as $index => $itemData) {
            $itemId = $itemData['id'] ?? null;

            $data = [
                'menu_id' => $menu->id,
                'parent_id' => $parentId,
                'menuable_type' => $itemData['menuable_type'] ?? null,
                'menuable_id' => $itemData['menuable_id'] ?? null,
                'link' => $itemData['link'] ?? null,
                'icon' => $itemData['icon'] ?? null,
                'target' => $itemData['target'] ?? '_self',
                'display_order' => $index,
                'box_key' => $itemData['box_key'] ?? 'custom',
                'label' => $itemData['label'] ?? null,
                'locale' => $itemData['locale'] ?? app()->getLocale(),
            ];

            if ($itemId && in_array($itemId, $existingItemIds)) {
                $menuItem = MenuItem::find($itemId);
                if ($menuItem) {
                    $menuItem->update($data);
                }
            } else {
                $menuItem = MenuItem::create($data);
                $itemId = $menuItem->id;
            }

            $processedItemIds[] = $itemId;

            if (! empty($itemData['children'])) {
                $this->processItems($menu, $itemData['children'], $itemId, $processedItemIds, $existingItemIds);
            }
        }
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
