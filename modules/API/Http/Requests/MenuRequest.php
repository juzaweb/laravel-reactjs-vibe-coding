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

namespace Juzaweb\Modules\API\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="MenuItemRequest",
 *      type="object",
 *
 *      @OA\Property(property="id", type="string", nullable=true, example="123e4567-e89b-12d3-a456-426614174000"),
 *      @OA\Property(property="menuable_type", type="string", nullable=true, example="Juzaweb\\Modules\\Core\\Models\\Post"),
 *      @OA\Property(property="menuable_id", type="string", nullable=true, example="123e4567-e89b-12d3-a456-426614174001"),
 *      @OA\Property(property="link", type="string", nullable=true, example="https://example.com"),
 *      @OA\Property(property="icon", type="string", nullable=true, example="fas fa-home"),
 *      @OA\Property(property="target", type="string", example="_self"),
 *      @OA\Property(property="box_key", type="string", example="custom"),
 *      @OA\Property(property="label", type="string", nullable=true, example="Home"),
 *      @OA\Property(property="locale", type="string", nullable=true, example="en"),
 *      @OA\Property(
 *          property="children",
 *          type="array",
 *
 *          @OA\Items(ref="#/components/schemas/MenuItemRequest")
 *      )
 * )
 *
 * @OA\Schema(
 *      schema="MenuRequest",
 *      type="object",
 *      required={"name"},
 *
 *      @OA\Property(property="name", type="string", example="Main Menu", description="The name of the menu"),
 *      @OA\Property(property="content", type="array", @OA\Items(ref="#/components/schemas/MenuItemRequest"), description="Array content of the menu items (required on PUT)")
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
