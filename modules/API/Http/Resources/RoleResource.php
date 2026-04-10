<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 */

namespace Juzaweb\Modules\Api\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Juzaweb\Modules\Core\Permissions\Models\Role;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="RoleResource",
 *      title="Role Resource",
 *      description="Role resource schema",
 *
 *      @OA\Property(property="id", type="integer", example=1),
 *      @OA\Property(property="code", type="string", example="admin"),
 *      @OA\Property(property="name", type="string", example="Admin"),
 *      @OA\Property(property="description", type="string", example="Admin role"),
 *      @OA\Property(property="grant_all_permissions", type="boolean", example=false),
 *      @OA\Property(property="created_at", type="string", format="date-time", example="2021-01-01T00:00:00Z"),
 *      @OA\Property(property="updated_at", type="string", format="date-time", example="2021-01-01T00:00:00Z"),
 *      @OA\Property(
 *          property="permissions",
 *          type="array",
 *
 *          @OA\Items(type="object")
 *      )
 * )
 *
 * @property-read Role $resource
 */
class RoleResource extends JsonResource
{
    public function toArray($request): array
    {
        $role = [
            'id' => $this->resource->id,
            'code' => $this->resource->code,
            'name' => $this->resource->name,
            'description' => $this->resource->description,
            'grant_all_permissions' => $this->resource->grant_all_permissions,
            'created_at' => $this->resource->created_at->toISOString(true),
            'updated_at' => $this->resource->updated_at->toISOString(true),
        ];

        if ($this->resource->relationLoaded('permissions')) {
            $role['permissions'] = PermissionResource::collection($this->resource->permissions);
        }

        return $role;
    }
}
