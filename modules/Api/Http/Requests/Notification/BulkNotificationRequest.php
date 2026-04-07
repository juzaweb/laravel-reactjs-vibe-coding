<?php

namespace Juzaweb\Modules\Api\Http\Requests\Notification;

use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      title="Bulk Notification Request",
 *      description="Request body data for bulk actions on notifications",
 *      type="object",
 *      required={"ids", "action"},
 *      @OA\Property(property="ids", type="array", description="Array of notification IDs", @OA\Items(type="string")),
 *      @OA\Property(property="action", type="string", description="Action to perform", enum={"delete", "mark_as_read", "mark_as_unread"})
 * )
 */
class BulkNotificationRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'ids' => 'required|array',
            'ids.*' => 'required|string',
            'action' => 'required|string|in:delete,mark_as_read,mark_as_unread',
        ];
    }
}
