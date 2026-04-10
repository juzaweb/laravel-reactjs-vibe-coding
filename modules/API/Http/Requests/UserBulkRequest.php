<?php

namespace Juzaweb\Modules\Api\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserBulkRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'ids' => 'required|array',
            'ids.*' => 'required|string',
            'action' => 'required|in:delete,active,inactive,banned',
        ];
    }
}
