<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 */

namespace Juzaweb\Modules\Api\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;
use Juzaweb\Modules\Core\Models\Media;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="MediaResource",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="readable_size", type="string"),
 *     @OA\Property(property="type", type="string"),
 *     @OA\Property(property="mime_type", type="string"),
 *     @OA\Property(property="size", type="integer"),
 *     @OA\Property(property="path", type="string"),
 *     @OA\Property(property="url", type="string"),
 *     @OA\Property(property="extension", type="string"),
 *     @OA\Property(property="disk", type="string"),
 *     @OA\Property(property="is_directory", type="boolean"),
 *     @OA\Property(property="is_image", type="boolean"),
 *     @OA\Property(property="is_video", type="boolean"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @property-read Media $resource
 */
class MediaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'readable_size' => $this->resource->readable_size,
            'type' => $this->resource->type,
            'mime_type' => $this->resource->mime_type,
            'size' => $this->resource->size,
            'path' => $this->resource->path,
            'url' => $this->resource->url,
            'extension' => $this->resource->extension,
            'disk' => $this->resource->disk,
            'is_directory' => $this->resource->is_directory,
            'is_image' => $this->resource->is_image,
            'is_video' => $this->resource->is_video,
            'conversions' => $this->resource->getConversionResponse(),
            'metadata' => $this->resource->metadata,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}
