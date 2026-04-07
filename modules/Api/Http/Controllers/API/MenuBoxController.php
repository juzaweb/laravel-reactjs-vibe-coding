<?php

namespace Juzaweb\Modules\Api\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use Juzaweb\Modules\Core\Facades\MenuBox;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use OpenApi\Annotations as OA;

class MenuBoxController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/menu-boxes",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Menus"},
     *      summary="Get list of menu boxes",
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *
     *              @OA\Property(property="data", type="array", @OA\Items(
     *                  @OA\Property(property="key", type="string", example="pages"),
     *                  @OA\Property(property="label", type="string", example="core::translation.pages"),
     *                  @OA\Property(property="icon", type="string", example="fas fa-layer-group"),
     *                  @OA\Property(property="priority", type="integer", example=1),
     *                  @OA\Property(property="field", type="string", example="title"),
     *              )),
     *              @OA\Property(property="success", type="boolean", example=true),
     *          )
     *      ),
     * )
     */
    public function index(): JsonResponse
    {
        $menuBoxes = MenuBox::all()->map(function ($box, $key) {
            $options = is_callable($box['options']) ? $box['options']() : [];

            return array_merge(['key' => $key], $options);
        })->values()->toArray();

        return $this->restSuccess($menuBoxes);
    }
}
