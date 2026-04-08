<?php

namespace Juzaweb\Modules\Payment\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Themes\Activators\SettingActivator;
use Juzaweb\Modules\Payment\Models\Order;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // The core requirement for tests to pass.
        app('config')->set('themes.activator', 'setting');
        app('config')->set('themes.activators.setting.class', SettingActivator::class);
        app('config')->set('themes.path', base_path('themes'));
        app('config')->set('app.key', 'base64:D6fZlKIkxqWaMJLmMkw170JIMRhWkQ25+wpmCwoUtD0=');
    }

    public function test_index_orders()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // User 2 creates an order
        $order2 = new Order([
            'quantity' => 2,
            'total_price' => 100,
            'total' => 100,
            'module' => 'test_module',
            'payment_method_name' => 'paypal',
        ]);
        $order2->created_by = $user2->id;
        $order2->created_type = User::class;
        $order2->save();

        $response = $this->actingAs($user1, 'api')->getJson('/api/v1/orders');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'success',
        ]);
        $response->assertJsonCount(0, 'data'); // User 1 should not see User 2's orders

        // User 1 creates an order
        $order1 = new Order([
            'quantity' => 1,
            'total_price' => 50,
            'total' => 50,
            'module' => 'test_module',
            'payment_method_name' => 'paypal',
        ]);
        $order1->created_by = $user1->id;
        $order1->created_type = User::class;
        $order1->save();

        $response2 = $this->actingAs($user1, 'api')->getJson('/api/v1/orders');
        $response2->assertStatus(200);
        $response2->assertJsonCount(1, 'data'); // User 1 should see their own order
    }

    public function test_store_order()
    {
        $user = User::factory()->create();

        $data = [
            'quantity' => 2,
            'module' => 'test_module',
        ];

        $response = $this->actingAs($user, 'api')->postJson('/api/v1/orders', $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'quantity' => 2,
            'module' => 'test_module',
            'created_by' => $user->id,
            'created_type' => User::class,
        ]);
    }

    public function test_show_order_authorization()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // User 1 creates an order directly
        $order = new Order([
            'quantity' => 2,
            'total_price' => 100,
            'total' => 100,
            'module' => 'test_module',
            'payment_method_name' => 'paypal',
        ]);
        $order->created_by = $user1->id;
        $order->created_type = User::class;
        $order->save();

        $orderId = $order->id;

        // User 1 should be able to see their own order
        $showResponse = $this->actingAs($user1, 'api')->getJson('/api/v1/orders/'.$orderId);
        $showResponse->assertStatus(200);

        // User 2 should NOT be able to see User 1's order
        $showResponse2 = $this->actingAs($user2, 'api')->getJson('/api/v1/orders/'.$orderId);
        $showResponse2->assertStatus(404);
    }
}
