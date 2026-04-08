<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 */

namespace Juzaweb\Modules\Subscription\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlanBulkRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'string'],
            'action' => ['required', 'string', 'in:delete,1,0'],
        ];
    }
}
