<?php

namespace Juzaweb\Modules\API\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="MediaRequest",
 *      type="object",
 *      required={"file"},
 *
 *      @OA\Property(property="file", type="string", format="binary", description="The file to upload"),
 *      @OA\Property(property="folder_id", type="integer", example=1, description="The ID of the folder where the media belongs (optional)")
 * )
 */
class MediaRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'file' => ['required', 'file'],
            'folder_id' => ['nullable', 'integer'],
        ];
    }
}
