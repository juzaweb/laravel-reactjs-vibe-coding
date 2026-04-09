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
     *              @OA\Property(
     *                  property="data",
     *                  type="object",
     *                  additionalProperties=true,
     *                  example={"site_name":"Juzaweb CMS","site_description":"My website"}
     *              ),
     *              @OA\Property(property="success", type="boolean", example=true),
     *          )
     *      ),
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Setting::query()->api($request->all());
        $settings = $query
            ->get()
            ->mapWithKeys(fn (Setting $setting) => [$setting->code => $setting->value])
            ->toArray();

        return $this->restSuccess($settings);
    }

    /**
     * @OA\Put(
     *      path="/api/v1/settings/{id}",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Settings"},
     *      summary="Update an existing setting",
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
     *      @OA\Response(response=404, description="Setting not found"),
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(SettingResourceRequest $request, string $id): JsonResponse
    {
        $setting = Setting::findOrFail($id);
        $setting->update($request->validated());

        return $this->restSuccess($setting);
    }
}
