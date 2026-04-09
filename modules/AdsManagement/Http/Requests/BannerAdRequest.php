<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 *
 * @license    GNU V2
 */

namespace Juzaweb\Modules\AdsManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Juzaweb\Modules\AdsManagement\Facades\Ads;

/**
 * @OA\Schema(
 *     schema="BannerAdRequest",
 *     required={"name", "type", "active", "position"},
 *
 *     @OA\Property(property="name", type="string", example="Banner 1"),
 *     @OA\Property(property="type", type="string", example="image"),
 *     @OA\Property(property="body_image", type="string", example="https://example.com/image.jpg"),
 *     @OA\Property(property="body_html", type="string", example="<img src='...' />"),
 *     @OA\Property(property="url", type="string", example="https://example.com"),
 *     @OA\Property(property="active", type="integer", example=1),
 *     @OA\Property(property="position", type="string", example="sidebar")
 * )
 */
class BannerAdRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'max:255'],
            'type' => ['required', 'in:html,image'],
            'body_image' => [Rule::requiredIf($this->input('type') === 'image')],
            'body_html' => [Rule::requiredIf($this->input('type') === 'html')],
            'url' => [Rule::requiredIf($this->input('type') === 'image'), 'url', 'max:255'],
            'active' => ['required', 'in:0,1'],
            'position' => ['required', 'max:50', Rule::in(Ads::bannerPositions()->keys())],
        ];
    }
}
