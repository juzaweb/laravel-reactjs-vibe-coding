<?php

namespace Juzaweb\Modules\Blog\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryBulkRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'ids' => 'required|array',
            'ids.*' => 'required|string',
            'action' => 'required|in:delete',
        ];
    }
}
