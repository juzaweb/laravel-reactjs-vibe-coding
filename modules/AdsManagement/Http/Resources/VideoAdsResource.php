<?php

namespace Juzaweb\Modules\AdsManagement\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="VideoAdsResource",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Video Ad 1"),
 *     @OA\Property(property="title", type="string", example="Check out this video"),
 *     @OA\Property(property="url", type="string", example="https://example.com"),
 *     @OA\Property(property="video", type="string", example="https://example.com/video.mp4"),
 *     @OA\Property(property="position", type="string", example="pre-roll"),
 *     @OA\Property(property="offset", type="integer", example=10),
 *     @OA\Property(property="options", type="object", example={}),
 *     @OA\Property(property="active", type="boolean", example=true),
 *     @OA\Property(property="views", type="integer", example=0),
 *     @OA\Property(property="click", type="integer", example=0),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 * )
 */
class VideoAdsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'title' => $this->title,
            'url' => $this->url,
            'video' => $this->video,
            'position' => $this->position,
            'offset' => $this->offset,
            'options' => $this->options,
            'active' => $this->active,
            'views' => $this->views,
            'click' => $this->click,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
