<?php

namespace Juzaweb\Modules\Subscription\Tests\Feature;

use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Subscription\Models\SubscriptionMethod;
use Juzaweb\Modules\Subscription\Tests\TestCase;

class SubscriptionMethodTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Ensure admin user
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
        $this->withoutMiddleware();
    }

    public function test_can_list_subscription_methods()
    {
        SubscriptionMethod::create([
            'driver' => 'PayPal',
            'config' => ['client_id' => '123'],
            'active' => 1,
            'name' => 'Paypal method',
            'locale' => 'en',
        ]);

        $response = $this->getJson('/api/v1/subscription/methods');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'driver', 'active'],
            ],
        ]);
    }

    public function test_can_create_subscription_method()
    {
        $data = [
            'name' => 'PayPal Sub',
            'driver' => 'PayPal',
            'description' => 'Paypal subscription driver',
            'locale' => 'en',
            'config' => ['client_id' => '123', 'secret' => '123'],
            'active' => true,
        ];

        $response = $this->postJson('/api/v1/subscription/methods', $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('subscription_methods', [
            'driver' => 'PayPal',
            'active' => 1,
        ]);
    }

    public function test_can_update_subscription_method()
    {
        $method = SubscriptionMethod::create([
            'driver' => 'PayPal',
            'config' => ['client_id' => '123'],
            'active' => false,
            'name' => 'Paypal method',
            'locale' => 'en',
        ]);

        $data = [
            'name' => 'PayPal Sub Updated',
            'driver' => 'PayPal',
            'description' => 'Paypal subscription driver',
            'locale' => 'en',
            'config' => ['client_id' => '123', 'secret' => '123'],
            'active' => true,
        ];

        $response = $this->putJson("/api/v1/subscription/methods/{$method->id}", $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('subscription_methods', [
            'id' => $method->id,
            'active' => 1,
        ]);
    }

    public function test_can_delete_subscription_method()
    {
        $method = SubscriptionMethod::create([
            'driver' => 'PayPal',
            'config' => ['client_id' => '123'],
            'active' => 1,
            'name' => 'Paypal method',
            'locale' => 'en',
        ]);

        $response = $this->deleteJson("/api/v1/subscription/methods/{$method->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('subscription_methods', [
            'id' => $method->id,
        ]);
    }
}
