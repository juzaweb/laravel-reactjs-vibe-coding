<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 */

namespace Juzaweb\Modules\Payment\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Juzaweb\Modules\Payment\Facades\PaymentManager;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      title="PaymentMethodRequest",
 *      description="Payment Method request body data",
 *      type="object",
 *      required={"driver", "name", "locale", "config", "active"}
 * )
 */
class PaymentMethodRequest extends FormRequest
{
    /**
     * @OA\Property(title="Driver", description="The payment driver", example="PayPal")
     */
    public string $driver;

    /**
     * @OA\Property(title="Name", description="The name of the payment method", example="PayPal Payment")
     */
    public string $name;

    /**
     * @OA\Property(title="Description", description="The description of the payment method", example="Pay via PayPal")
     */
    public string $description;

    /**
     * @OA\Property(title="Locale", description="The language locale", example="en")
     */
    public ?string $locale;

    /**
     * @OA\Property(title="Config", description="Configuration for the payment method driver", type="object")
     */
    public array $config;

    /**
     * @OA\Property(title="Active", description="Whether the payment method is active", example=true)
     */
    public bool $active;

    public function rules(): array
    {
        return [
            'driver' => [
                Rule::requiredIf(! $this->route('id')),
                Rule::in(array_keys(PaymentManager::drivers())),
            ],
            'name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:500'],
            'locale' => ['required', 'string', 'max:10', 'exists:languages,code'],
            'config' => ['nullable', 'array'],
            'active' => ['required', 'boolean'],
        ];
    }
}
