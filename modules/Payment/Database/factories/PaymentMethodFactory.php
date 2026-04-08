<?php

namespace Juzaweb\Modules\Payment\Database\factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Juzaweb\Modules\Payment\Models\PaymentMethod;

class PaymentMethodFactory extends Factory
{
    protected $model = PaymentMethod::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'driver' => 'Custom',
            'config' => [],
            'active' => true,
        ];
    }
}
