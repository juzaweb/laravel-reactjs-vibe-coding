<?php

namespace Juzaweb\Modules\AdsManagement\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="BannerAdsResource",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Banner 1"),
 *     @OA\Property(property="active", type="boolean", example=true),
 *     @OA\Property(property="url", type="string", example="https://example.com"),
 *     @OA\Property(property="size", type="string", example="300x250"),
 *     @OA\Property(property="type", type="string", example="image"),
 *     @OA\Property(property="views", type="integer", example=0),
 *     @OA\Property(property="click", type="integer", example=0),
 *     @OA\Property(property="body", type="string", example="<img src='...' />"),
 *     @OA\Property(property="position", type="string", example="sidebar"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 * )
 */
class BannerAdsResource extends JsonResource
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
            'active' => $this->active,
            'url' => $this->url,
            'size' => $this->size,
            'type' => $this->type instanceof \UnitEnum ? $this->type->value : $this->type,
            'views' => $this->views,
            'click' => $this->click,
            'body' => $this->getBody(),
            'position' => $this->positions()->first()->position ?? null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
