<?php

namespace Juzaweb\Modules\API\Http\Resources\App;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="AppMenuItemResource",
 *
 *     @OA\Property(property="id", type="string", example="550e8400-e29b-41d4-a716-446655440000"),
 *     @OA\Property(property="label", type="string", example="Home"),
 *     @OA\Property(property="link", type="string", example="https://example.com/home"),
 *     @OA\Property(property="url", type="string", nullable=true, example="https://example.com/home"),
 *     @OA\Property(property="icon", type="string", nullable=true, example="fa fa-home"),
 *     @OA\Property(property="target", type="string", example="_self"),
 *     @OA\Property(property="box_key", type="string", example="custom"),
 *     @OA\Property(
 *         property="children",
 *         type="array",
 *
 *         @OA\Items(ref="#/components/schemas/AppMenuItemResource")
 *     )
 * )
 */
class MenuItemResource extends JsonResource
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
            'label' => $this->resource->label,
            'link' => $this->resource->link,
            'url' => $this->resource->getUrl(),
            'icon' => $this->resource->icon,
            'target' => $this->resource->target,
            'box_key' => $this->resource->box_key,
            'children' => MenuItemResource::collection($this->whenLoaded('children')),
        ];
    }
}
