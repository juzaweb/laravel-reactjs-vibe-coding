<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 */

namespace Juzaweb\Modules\Api\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Juzaweb\Modules\Core\Rules\AllExist;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="PostRequest",
 *      type="object",
 *      required={"title"},
 *
 *      @OA\Property(property="title", type="string", example="Post Title"),
 *      @OA\Property(property="content", type="string", example="Post content"),
 *      @OA\Property(property="slug", type="string", example="post-slug"),
 *      @OA\Property(property="thumbnail", type="string", example="https://example.com/thumbnail.jpg"),
 *      @OA\Property(property="status", type="string", example="published"),
 *      @OA\Property(property="categories", type="array", @OA\Items(type="integer")),
 *      @OA\Property(property="tags", type="array", @OA\Items(type="string"))
 * )
 */
class PostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string', 'max:50000'],
            'slug' => ['nullable', 'string', 'max:255'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:draft,published,private'],
            'categories' => ['nullable', 'array', AllExist::make('post_categories', 'id')],
            'tags' => ['nullable', 'array'],
        ];
    }
}
