<?php

namespace Juzaweb\Modules\Blog\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="PostResource",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Post Title"),
 *     @OA\Property(property="slug", type="string", example="post-title"),
 *     @OA\Property(property="content", type="string", example="Post content"),
 *     @OA\Property(property="thumbnail", type="string", example="https://example.com/thumbnail.jpg"),
 *     @OA\Property(property="status", type="string", enum={"published", "private", "draft"}),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 * )
 */
class PostResource extends JsonResource
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
            'content' => $this->resource->content,
            'thumbnail' => $this->resource->thumbnail,
            'status' => $this->resource->status,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}
