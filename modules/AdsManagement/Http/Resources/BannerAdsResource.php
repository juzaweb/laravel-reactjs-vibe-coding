<?php

namespace Juzaweb\Modules\AdsManagement\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BannerAdsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
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
