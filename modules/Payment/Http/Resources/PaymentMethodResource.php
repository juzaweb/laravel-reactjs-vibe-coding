<?php

namespace Juzaweb\Modules\Payment\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="PaymentMethodResource",
 *
 *     @OA\Property(property="id", type="string", example="550e8400-e29b-41d4-a716-446655440000"),
 *     @OA\Property(property="name", type="string", example="PayPal"),
 *     @OA\Property(property="description", type="string", example="Pay via PayPal"),
 *     @OA\Property(property="driver", type="string", example="PayPal"),
 *     @OA\Property(property="active", type="boolean", example=true),
 *     @OA\Property(property="sandbox", type="boolean", example=false),
 *     @OA\Property(property="config", type="object", example={"sandbox": false}),
 *     @OA\Property(property="locale", type="string", example="en"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 * )
 */
class PaymentMethodResource extends JsonResource
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
            'driver' => $this->resource->driver,
            'active' => $this->resource->active,
            'sandbox' => $this->resource->sandbox,
            'config' => $this->resource->config,
            'locale' => $this->resource->locale ?: app()->getLocale(),
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}
