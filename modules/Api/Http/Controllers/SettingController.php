<?php

namespace Juzaweb\Modules\Api\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Api\Http\Requests\SettingRequest;
use Juzaweb\Modules\Core\Facades\Setting as SettingFacade;
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
     *      path="/api/v1/settings",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Settings"},
     *      summary="Bulk update settings",
     *
     *      @OA\RequestBody(
     *          required=true,
     *
     *          @OA\JsonContent(
     *              required={"settings"},
     *              @OA\Property(
     *                  property="settings",
     *                  type="object",
     *                  additionalProperties=true,
     *                  example={"site_name":"Juzaweb CMS","site_description":"My website"}
     *              )
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
    public function update(SettingRequest $request): JsonResponse
    {
        $settings = SettingFacade::sets($request->validated());

        return $this->restSuccess($settings->toArray());
    }
}
