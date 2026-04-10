<?php

namespace Juzaweb\Modules\API\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Juzaweb\Modules\Core\Permissions\Models\Role;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="RoleRequest",
 *      title="Role Request",
 *      description="Role request schema",
 *      required={"name", "code"},
 *
 *      @OA\Property(property="name", type="string", example="Admin"),
 *      @OA\Property(property="code", type="string", example="admin"),
 *      @OA\Property(
 *          property="permissions",
 *          type="array",
 *
 *          @OA\Items(type="string"),
 *          example={"create_posts", "edit_posts"}
 *      )
 * )
 */
class RoleRequest extends FormRequest
{
    public function rules(): array
    {
        $id = $this->route('role');

        return [
            'name' => ['required', 'string', 'max:100'],
            'code' => [
                'required',
                'string',
                'max:50',
                'alpha_dash',
                Rule::unique((new Role)->getTable(), 'code')->ignore($id),
            ],
            'permissions' => ['nullable', 'array'],
        ];
    }
}
