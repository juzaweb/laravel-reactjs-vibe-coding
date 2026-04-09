<?php

namespace Juzaweb\Modules\Api\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Juzaweb\Modules\Core\Rules\XssBlock;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="TranslationRequest",
 *      type="object",
 *      required={"group", "namespace", "key", "value"},
 *
 *      @OA\Property(property="group", type="string", example="*"),
 *      @OA\Property(property="namespace", type="string", example="core"),
 *      @OA\Property(property="key", type="string", example="app.save"),
 *      @OA\Property(property="value", type="string", example="Save")
 * )
 */
class TranslationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'group' => 'required|string|max:255',
            'namespace' => 'required|string|max:255',
            'key' => 'required|string|max:255',
            'value' => ['required', 'string', new XssBlock],
        ];
    }
}
