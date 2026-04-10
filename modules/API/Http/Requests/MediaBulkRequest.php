<?php

namespace Juzaweb\Modules\API\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MediaBulkRequest extends FormRequest
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
