<?php

namespace Juzaweb\Modules\Api\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TranslationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'group' => 'required|string',
            'namespace' => 'required|string',
            'key' => 'required|string',
            'value' => 'required|string',
        ];
    }
}
