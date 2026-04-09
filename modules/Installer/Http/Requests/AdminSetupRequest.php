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

class AdminSetupRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|max:150',
            'email' => 'required|email|max:150',
            'password' => 'required|max:32|min:8|confirmed',
            'password_confirmation' => 'required|max:32|min:8',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => trans('installer::message.environment.wizard.form.name'),
            'email' => trans('installer::message.environment.wizard.form.email'),
            'password' => trans('installer::message.environment.wizard.form.password'),
            'password_confirmation' => trans('installer::message.environment.wizard.form.password_confirmation'),
        ];
    }
}
