<?php

namespace Juzaweb\Modules\Api\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
                'array',
            ],
            'ids.*' => [
                'integer',
            ],
            'locale' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (! array_key_exists($value, config('locales', []))) {
                        $fail('The selected locale is invalid.');
                    }
                },
            ],
            'source' => [
                'nullable',
                'string',
            ],
        ];
    }
}
