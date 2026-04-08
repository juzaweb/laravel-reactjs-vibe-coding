<?php

namespace Juzaweb\Modules\Subscription\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Juzaweb\Modules\Subscription\Facades\Subscription;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      title="SubscriptionMethodRequest",
 *      description="Subscription Method request body data",
 *      type="object",
 *      required={"driver", "name", "locale", "config", "active"}
 * )
 */
class SubscriptionMethodRequest extends FormRequest
{
    /**
     * @OA\Property(title="Driver", description="The subscription driver", example="PayPal")
     */
    public string $driver;

    /**
     * @OA\Property(title="Name", description="The name of the subscription method", example="PayPal Subscription")
     */
    public string $name;

    /**
     * @OA\Property(title="Description", description="The description of the subscription method", example="Subscribe via PayPal")
     */
    public string $description;

    /**
     * @OA\Property(title="Locale", description="The language locale", example="en")
     */
    public ?string $locale;

    /**
     * @OA\Property(title="Config", description="Configuration for the subscription method driver", type="object")
     */
    public array $config;

    /**
     * @OA\Property(title="Active", description="Whether the subscription method is active", example=true)
     */
    public bool $active;

    public function rules(): array
    {
        return [
            'driver' => [
                Rule::requiredIf(! $this->route('id')),
                Rule::in(array_keys(Subscription::drivers()->toArray())),
            ],
            'name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:500'],
            'locale' => ['required', 'string', 'max:10', 'exists:languages,code'],
            'config' => ['required', 'array'],
            'active' => ['required', 'boolean'],
        ];
    }
}
