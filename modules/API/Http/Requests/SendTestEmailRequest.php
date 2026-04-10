<?php

namespace Juzaweb\Modules\API\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @OA\Schema(
 *     schema="SendTestEmailRequest",
 *     title="Send Test Email Request",
 *
 *     @OA\Property(property="email", type="string", format="email", example="example@gmail.com")
 * )
 */
class SendTestEmailRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:150'],
        ];
    }
}
