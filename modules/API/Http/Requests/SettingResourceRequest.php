<?php

namespace Juzaweb\Modules\API\Http\Requests;

use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Juzaweb\Modules\Core\Contracts\Setting as SettingContract;

class SettingResourceRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'settings' => [
                'required',
                'array',
                'min:1',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if (! is_array($value)) {
                        return;
                    }

                    $requestKeys = array_keys($value);
                    if (empty($requestKeys)) {
                        return;
                    }

                    $validKeys = app(SettingContract::class)
                        ->settings()
                        ->keys()
                        ->all();

                    $invalidKeys = array_values(array_diff($requestKeys, $validKeys));
                    if (! empty($invalidKeys)) {
                        $fail(
                            'The following setting keys are invalid: '.implode(', ', $invalidKeys)
                        );
                    }
                },
            ],
        ];
    }
}
