<?php

namespace Juzaweb\Modules\Api\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Models\Setting;
use OpenApi\Annotations as OA;

class SettingController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/settings",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Settings"},
     *      summary="Get list of settings",
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
     *              @OA\Property(property="data", type="array", @OA\Items(type="object")),
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

        $query = Setting::query()->api($request->all());

        $settings = $query->paginate($limit);

        return $this->restSuccess($settings);
    }

    /**
     * @OA\Get(
     *      path="/api/v1/settings/configs",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Settings"},
     *      summary="Get settings as key-value pairs for forms",
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *              @OA\Property(property="data", type="object"),
     *              @OA\Property(property="success", type="boolean", example=true),
     *          )
     *      ),
     * )
     */
    public function configs(Request $request): JsonResponse
    {
        $query = Setting::query()->api($request->all());

        // Get all items and map them to code => value format as requested for the form
        $settings = $query->get()->pluck('value', 'code');

        return $this->restSuccess($settings);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/settings",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Settings"},
     *      summary="Update multiple settings in bulk",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *              example={"title": "New Title", "description": "New Description"},
     *              type="object"
     *          )
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *
     *           @OA\JsonContent(@OA\Property(property="data", type="object"))
     *       ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->all();

        \Juzaweb\Modules\Core\Facades\Setting::sets($data);

        return $this->restSuccess($data);
    }
}
