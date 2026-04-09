<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 */

namespace Juzaweb\Modules\AdsManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @OA\Schema(
 *     schema="VideoAdsRequest",
 *     required={"name", "title", "url", "video", "position", "offset", "active"},
 *
 *     @OA\Property(property="name", type="string", example="Video Ad 1"),
 *     @OA\Property(property="title", type="string", example="Check out this video"),
 *     @OA\Property(property="url", type="string", example="https://example.com"),
 *     @OA\Property(property="video", type="string", example="https://example.com/video.mp4"),
 *     @OA\Property(property="position", type="string", example="pre-roll"),
 *     @OA\Property(property="offset", type="integer", example=10),
 *     @OA\Property(property="active", type="boolean", example=true)
 * )
 */
class VideoAdsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'max:250'],
            'title' => ['required', 'max:250'],
            'url' => ['required', 'max:250'],
            'video' => ['required', 'max:500'],
            'position' => ['required'],
            'offset' => ['required', 'integer', 'min:0'],
            'active' => ['required', 'boolean'],
        ];
    }
}
