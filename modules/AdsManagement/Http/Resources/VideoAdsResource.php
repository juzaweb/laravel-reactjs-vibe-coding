<?php

namespace Juzaweb\Modules\AdsManagement\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
