<?php

namespace Juzaweb\Modules\API\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Juzaweb\Modules\API\Http\Requests\SendTestEmailRequest;
use Juzaweb\Modules\API\Http\Requests\SettingRequest;
use Juzaweb\Modules\Core\Facades\Setting as SettingFacade;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Mail\Test;
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
        $query = Setting::query();
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
     *
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

    /**
     * @OA\Post(
     *      path="/api/v1/settings/test-email",
     *      security={{"bearerAuth": {}, "apiKey": {}}},
     *      tags={"Settings"},
     *      summary="Send test email",
     *
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/SendTestEmailRequest")
     *      ),
     *
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *           @OA\JsonContent(
     *               @OA\Property(property="message", type="string", example="Test email sent successfully."),
     *               @OA\Property(property="success", type="boolean", example=true)
     *           )
     *       ),
     *
     *      @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function testEmail(SendTestEmailRequest $request): JsonResponse
    {
        try {
            Mail::to($request->input('email'))->send(new Test());
            
            return $this->restSuccess([], __('Test email sent successfully.'));
        } catch (\Exception $e) {
            return $this->restFail($e->getMessage());
        }
    }
}
