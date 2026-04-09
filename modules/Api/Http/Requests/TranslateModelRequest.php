<?php

namespace Juzaweb\Modules\Api\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="TranslateModelRequest",
 *      type="object",
 *      required={"model", "ids", "locale"},
 *
 *      @OA\Property(property="model", type="string", description="Encrypted model class name"),
 *      @OA\Property(property="ids", type="array", @OA\Items(type="integer"), example={1, 2, 3}),
 *      @OA\Property(property="locale", type="string", example="vi"),
 *      @OA\Property(property="source", type="string", example="en")
 * )
 */
class TranslateModelRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'model' => [
                'required',
                'string',
            ],
            'ids' => [
                'required',
            ],
            'locale' => [
                'required',
                'string',
                Rule::in(array_keys(config('locales', []))),
            ],
        ];
    }
}
