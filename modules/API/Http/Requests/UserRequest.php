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

namespace Juzaweb\Modules\API\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Juzaweb\Modules\Core\Rules\AllExist;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="UserRequest",
 *      type="object",
 *      required={"name", "email"},
 *
 *      @OA\Property(property="name", type="string", example="John Doe"),
 *      @OA\Property(property="email", type="string", example="john@example.com"),
 *      @OA\Property(property="password", type="string", example="password123"),
 *      @OA\Property(property="password_confirmation", type="string", example="password123"),
 *      @OA\Property(property="roles", type="array", @OA\Items(type="integer"))
 * )
 */
class UserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $this->route('id'),
            'password' => [
                Rule::requiredIf(fn() => $this->isMethod('post')),
                'nullable', // Allow null for PUT/PATCH requests
                'string',
                'min:8', // Minimum 8 characters
                'confirmed', // Must match the password confirmation field
            ],
            'roles' => ['nullable', 'array', AllExist::make('roles', 'id')],
        ];
    }
}
