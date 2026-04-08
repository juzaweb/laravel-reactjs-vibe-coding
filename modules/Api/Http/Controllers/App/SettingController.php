<?php

namespace Juzaweb\Modules\Api\Http\Controllers\App;

use Illuminate\Http\JsonResponse;
use Juzaweb\Modules\Core\Facades\Module;
use Juzaweb\Modules\Core\Facades\Setting;
use Juzaweb\Modules\Core\Http\Controllers\APIController;
use Juzaweb\Modules\Core\Translations\Models\Language;
use Juzaweb\Modules\Api\Http\Requests\SettingRequest;
use OpenApi\Annotations as OA;

class SettingController extends APIController
{
    /**
     * @OA\Get(
     *      path="/api/v1/app/settings",
     *      tags={"Settings"},
     *      summary="Get site settings",
     *      description="Returns key-value pairs of public site settings such as title, logo, language, etc.",
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *
     *          @OA\JsonContent(
     *              type="object",
     *
     *              @OA\Property(
     *                  property="data",
     *                  type="object",
     *                  @OA\Property(property="title", type="string", example="My Site"),
     *                  @OA\Property(property="description", type="string", example="Site description"),
     *                  @OA\Property(property="sitename", type="string", example="mysite"),
     *                  @OA\Property(property="logo", type="string", example="https://example.com/logo.png"),
     *                  @OA\Property(property="favicon", type="string", example="https://example.com/favicon.ico"),
     *                  @OA\Property(property="banner", type="string", example="https://example.com/banner.jpg"),
     *                  @OA\Property(property="language", type="string", example="en"),
     *                  @OA\Property(property="captcha", type="string", example="recaptcha"),
     *                  @OA\Property(property="captcha_site_key", type="string", example="site_key"),
     *                  @OA\Property(
     *                      property="languages",
     *                      type="object",
     *                      description="Available languages with code as key and name as value",
     *                      example={"en": "English", "vi": "Vietnamese", "ja": "Japanese"},
     *
     *                      @OA\AdditionalProperties(
     *                          type="string",
     *                          description="Language name, e.g. English, Vietnamese, Japanese"
     *                      )
     *                  ),
     *
     *                  @OA\Property(
     *                      property="active_modules",
     *                      type="array",
     *                      description="List of active module names",
     *
     *                      @OA\Items(type="string", example="Blog")
     *                  )
     *              )
     *          )
     *      ),
     *
     *      @OA\Response(response=500, description="Server error", ref="#/components/responses/error_500")
     * )
     */
    public function index(): JsonResponse
    {
        $keys = apply_filters(
            'jw_api_setting_keys',
            [
                'title',
                'description',
                'sitename',
                'logo',
                'favicon',
                'banner',
                'language',
                'captcha',
                'captcha_site_key',
            ]
        );

        return $this->restSuccess(
            [
                ...Setting::gets($keys),
                'languages' => Language::languages()->mapWithKeys(function ($item) {
                    return [$item->code => $item->name];
                })->toArray(),
                'active_modules' => array_keys(Module::allEnabled()),
            ]
        );
    }

    /**
     * @OA\Post(
     *      path="/api/v1/app/settings",
     *      tags={"Settings"},
     *      summary="Update site settings",
     *      description="Update key-value pairs of public site settings such as title, logo, language, etc.",
     *      security={{"bearerAuth":{}}},
     *
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(property="title", type="string", example="My Site"),
     *              @OA\Property(property="description", type="string", example="Site description"),
     *              @OA\Property(property="sitename", type="string", example="mysite"),
     *              @OA\Property(property="logo", type="string", example="https://example.com/logo.png"),
     *              @OA\Property(property="favicon", type="string", example="https://example.com/favicon.ico"),
     *              @OA\Property(property="banner", type="string", example="https://example.com/banner.jpg"),
     *              @OA\Property(property="language", type="string", example="en"),
     *              @OA\Property(property="user_registration", type="string", example="1"),
     *              @OA\Property(property="user_verification", type="string", example="1"),
     *              @OA\Property(property="custom_header_script", type="string", example="<script></script>"),
     *              @OA\Property(property="custom_footer_script", type="string", example="<script></script>"),
     *              @OA\Property(property="enable_cookie_consent", type="string", example="1"),
     *              @OA\Property(property="cookie_consent_message", type="string", example="Message"),
     *              @OA\Property(property="google_analytics", type="string", example="G-123"),
     *          )
     *      ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     *
     *      @OA\Response(response=500, description="Server error", ref="#/components/responses/error_500")
     * )
     */
    public function update(SettingRequest $request): JsonResponse
    {
        Setting::sets($request->all());

        return $this->restSuccess([], 'Settings updated successfully.');
    }
}
