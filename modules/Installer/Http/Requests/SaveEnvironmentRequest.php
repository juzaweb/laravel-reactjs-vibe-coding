<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 *
 * @license    GNU V2
 */

namespace Juzaweb\Modules\Installer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveEnvironmentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'database_hostname' => 'required|string|max:150',
            'database_port' => 'required|numeric',
            'database_name' => 'required|string|max:150',
            'database_username' => 'required|string|max:150',
            'database_password' => 'nullable|string|max:150',
        ];
    }
}
