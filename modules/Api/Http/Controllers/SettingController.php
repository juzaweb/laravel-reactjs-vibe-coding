<?php

namespace Juzaweb\Modules\Api\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Api\Http\Requests\SettingResourceRequest;
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
     *      summary="Get list of settings as key-value pairs",
     *
     *      @OA\Parameter(ref="#/components/parameters/query_keyword"),
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
    public function index(Request $request): JsonResponse
    {
        $query = Setting::query()->api($request->all());

        // Get all items and map them to code => value format as requested
        $settings = $query->get()->pluck('value', 'code');

        return $this->restSuccess($settings);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/settings/{code}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Settings"},
     *      summary="Update an existing setting or create if not exists",
     *
     *      @OA\Parameter(
     *          name="code",
     *          in="path",
     *          required=true,
     *          description="Setting Code (acts as ID)",
     *          @OA\Schema(type="string")
     *      ),
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *              required={"code"},
     *
     *              @OA\Property(property="code", type="string", example="site_name"),
     *              @OA\Property(property="value", type="string", example="Juzaweb CMS")
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
    public function update(SettingResourceRequest $request, string $id): JsonResponse
    {
        // Using $id as the "code" so we don't need numeric IDs when bulk updating from frontend
        $setting = Setting::firstOrNew(['code' => $id]);
        $setting->fill($request->validated());
        $setting->save();

        return $this->restSuccess($setting);
    }
}
