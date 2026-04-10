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

namespace Juzaweb\Modules\Api\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="MenuRequest",
 *      type="object",
 *      required={"name"},
 *
 *      @OA\Property(property="name", type="string", example="Main Menu", description="The name of the menu"),
 *      @OA\Property(property="content", type="array", @OA\Items(), example="{}", description="Array content of the menu items (required on PUT)")
 * )
 */
class MenuRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'content' => [Rule::requiredIf($this->isMethod('put')), 'array'],
        ];
    }
}
