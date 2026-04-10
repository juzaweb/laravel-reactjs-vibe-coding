<?php

namespace Juzaweb\Modules\API\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="PageResource",
 *
 *     @OA\Property(property="id", type="string"),
 *     @OA\Property(property="title", type="string", example="About Us"),
 *     @OA\Property(property="slug", type="string", example="about-us"),
 *     @OA\Property(property="description", type="string", example="About us description"),
 *     @OA\Property(property="content", type="string", example="About us content"),
 *     @OA\Property(property="template", type="string", example="page"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 * )
 */
class PageResource extends JsonResource
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
            'title' => $this->resource->title,
            'slug' => $this->resource->slug,
            'description' => $this->resource->description,
            'content' => $this->resource->content,
            'template' => $this->resource->template,
            'status' => $this->resource->status instanceof \UnitEnum ? $this->resource->status->value : $this->resource->status,
            'locale' => $this->resource->locale,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}
