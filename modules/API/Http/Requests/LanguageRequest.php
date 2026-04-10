<?php

namespace Juzaweb\Modules\API\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LanguageRequest extends FormRequest
{
    public function rules(): array
    {
        $id = $this->route('id') ?? $this->route('language');
        $availableLocales = array_keys(config('locales', []));

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('languages', 'code')->ignore($id),
                Rule::in($availableLocales),
            ],
            'name' => 'required|string|max:250',
        ];
    }
}
