<?php

namespace Juzaweb\Modules\Payment\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="OrderResource",
 *
 *     @OA\Property(property="id", type="string", example="550e8400-e29b-41d4-a716-446655440000"),
 *     @OA\Property(property="code", type="string", example="ORD-12345"),
 *     @OA\Property(property="address", type="string", example="123 Main St"),
 *     @OA\Property(property="country_code", type="string", example="US"),
 *     @OA\Property(property="quantity", type="integer", example=2),
 *     @OA\Property(property="total_price", type="number", format="float", example=100.00),
 *     @OA\Property(property="total", type="number", format="float", example=100.00),
 *     @OA\Property(property="payment_method_id", type="integer", example=1),
 *     @OA\Property(property="payment_method_name", type="string", example="PayPal"),
 *     @OA\Property(property="note", type="string", example="Please deliver between 9 AM and 5 PM"),
 *     @OA\Property(property="payment_status", type="string", enum={"pending", "completed", "failed", "processing", "cancel"}),
 *     @OA\Property(property="delivery_status", type="string", enum={"pending", "processing", "delivering", "delivered", "cancel"}),
 *     @OA\Property(property="module", type="string", example="payment"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2022-01-01T00:00:00.000000Z"),
 * )
 */
class OrderResource extends JsonResource
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
            'code' => $this->resource->code,
            'address' => $this->resource->address,
            'country_code' => $this->resource->country_code,
            'quantity' => $this->resource->quantity,
            'total_price' => $this->resource->total_price,
            'total' => $this->resource->total,
            'payment_method_id' => $this->resource->payment_method_id,
            'payment_method_name' => $this->resource->payment_method_name,
            'note' => $this->resource->note,
            'payment_status' => $this->resource->payment_status?->value,
            'delivery_status' => $this->resource->delivery_status?->value,
            'module' => $this->resource->module,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}
