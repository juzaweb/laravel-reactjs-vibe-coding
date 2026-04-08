<?php

namespace Juzaweb\Modules\Payment\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @OA\Schema(
 *     schema="UpdateOrderRequest",
 *
 *     @OA\Property(property="address", type="string", example="123 Main St"),
 *     @OA\Property(property="country_code", type="string", example="US"),
 *     @OA\Property(property="quantity", type="integer", example=2),
 *     @OA\Property(property="note", type="string", example="Please deliver between 9 AM and 5 PM"),
 *     @OA\Property(property="module", type="string", example="payment"),
 * )
 */
class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'address' => ['nullable', 'string', 'max:250'],
            'country_code' => ['nullable', 'string', 'max:10'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'note' => ['nullable', 'string', 'max:500'],
            'module' => ['nullable', 'string', 'max:50'],
        ];
    }
}
