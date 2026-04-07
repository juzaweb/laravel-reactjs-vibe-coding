<?php

namespace Juzaweb\Modules\Blog\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="CategoryResource",
 *      type="object",
 *
 *      @OA\Property(property="id", type="string"),
 *      @OA\Property(property="name", type="string"),
 *      @OA\Property(property="description", type="string"),
 *      @OA\Property(property="slug", type="string"),
 *      @OA\Property(property="parent_id", type="string"),
 *      @OA\Property(property="created_at", type="string", format="date-time"),
 *      @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'description' => $this->resource->description,
            'slug' => $this->resource->slug,
            'parent_id' => $this->resource->parent_id,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}
