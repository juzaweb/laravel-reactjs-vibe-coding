<?php

namespace Juzaweb\Modules\Api\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingResourceRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'settings' => ['required', 'array', 'min:1'],
        ];
    }
}
