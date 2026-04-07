<?php

namespace Juzaweb\Modules\Blog\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="CategoryRequest",
 *      type="object",
 *      required={"name"},
 *
 *      @OA\Property(property="name", type="string", example="Category Name"),
 *      @OA\Property(property="description", type="string", nullable=true, example="Category description"),
 *      @OA\Property(property="slug", type="string", nullable=true, example="category-slug"),
 *      @OA\Property(property="parent_id", type="string", nullable=true, example="null")
 * )
 */
class CategoryRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'slug' => ['nullable', 'string', 'max:255'],
            'parent_id' => ['nullable', 'string', 'exists:post_categories,id'],
        ];
    }
}
