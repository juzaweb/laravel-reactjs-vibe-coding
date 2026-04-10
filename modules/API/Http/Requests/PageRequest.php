<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 *
 * @license    GNU V2
 */

namespace Juzaweb\Modules\API\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Juzaweb\Modules\Core\Enums\PageStatus;
use Juzaweb\Modules\Core\Facades\PageTemplate;
use Juzaweb\Modules\Core\Translations\Models\Language;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      schema="PageRequest",
 *      type="object",
 *      required={"title", "locale", "status"},
 *
 *      @OA\Property(property="locale", type="string", example="en"),
 *      @OA\Property(property="status", type="string", example="published"),
 *      @OA\Property(property="title", type="string", example="Page Title"),
 *      @OA\Property(property="slug", type="string", example="page-slug"),
 *      @OA\Property(property="content", type="string", example="Page content"),
 *      @OA\Property(property="template", type="string", example="default"),
 *      @OA\Property(property="thumbnail", type="string")
 * )
 */
class PageRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $merge = [];

        if ($this->has('title')) {
            $title = $this->input('title');
            if (is_string($title)) {
                $title = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $title);
                $merge['title'] = strip_tags($title);
            }
        }

        if ($this->has('content')) {
            $content = $this->input('content');
            if (is_string($content)) {
                $merge['content'] = clean_html($content);
            }
        }

        if (! empty($merge)) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        $templates = collect(PageTemplate::all())
            ->map(fn ($item) => $item->key)
            ->values()
            ->toArray();

        return [
            'locale' => ['required', 'string', Rule::in(Language::languages()->keys())],
            'status' => ['required', 'string', Rule::in(array_keys(PageStatus::all()))],
            'blocks' => ['nullable', 'array'],
            'template' => ['nullable', Rule::in($templates)],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:100'],
            'content' => ['nullable', 'string', 'max:50000'],
            'thumbnail' => ['nullable', 'string'],
            'is_home' => ['nullable', 'boolean'],
        ];
    }
}
