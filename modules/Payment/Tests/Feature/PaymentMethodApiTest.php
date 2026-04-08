<?php

namespace Juzaweb\Modules\Payment\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Themes\Activators\SettingActivator;
use Juzaweb\Modules\Payment\Models\PaymentMethod;
use Juzaweb\Modules\Payment\Providers\PaymentServiceProvider;
use Juzaweb\Modules\Payment\Tests\TestCase;

class PaymentMethodApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    protected function getEnvironmentSetUp($app): void
    {
        parent::getEnvironmentSetUp($app);

        $app['config']->set('themes.path', base_path('themes'));
        $app['config']->set('themes.activator', 'setting');
        $app['config']->set('themes.activators.setting.class', SettingActivator::class);
        $app['config']->set('juzaweb.theme', 'default');

        $app->register(PaymentServiceProvider::class);
    }

    public function test_index()
    {
        PaymentMethod::factory()->create(['driver' => 'Driver1']);
        PaymentMethod::factory()->create(['driver' => 'Driver2']);
        PaymentMethod::factory()->create(['driver' => 'Driver3']);

        $response = $this->actingAs($this->user)->getJson('/api/v1/payment-methods');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'driver',
                    'active',
                ],
            ],
            'meta',
            'links',
        ]);
    }

    public function test_store()
    {
        $data = [
            'driver' => 'Custom',
            'name' => 'Custom Method',
            'locale' => 'en',
            'config' => ['test' => 'test'],
            'active' => true,
        ];

        $response = $this->actingAs($this->user)->postJson('/api/v1/payment-methods', $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('payment_methods', [
            'driver' => 'Custom',
            'active' => true,
        ]);
    }

    public function test_show()
    {
        $method = PaymentMethod::factory()->create([
            'name' => 'Test Method',
            'driver' => 'Custom',
            'config' => [],
            'active' => true,
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/payment-methods/'.$method->id);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'driver' => 'Custom',
        ]);
    }

    public function test_update()
    {
        $method = PaymentMethod::factory()->create([
            'name' => 'Test Method',
            'driver' => 'Custom',
            'config' => [],
            'active' => true,
        ]);

        $data = [
            'driver' => 'Custom',
            'name' => 'Updated Custom Method',
            'locale' => 'en',
            'config' => ['test' => 'test'],
            'active' => false,
        ];

        $response = $this->actingAs($this->user)->putJson('/api/v1/payment-methods/'.$method->id, $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('payment_methods', [
            'id' => $method->id,
            'active' => false,
        ]);
    }

    public function test_destroy()
    {
        $method = PaymentMethod::factory()->create([
            'name' => 'Test Method',
            'driver' => 'Custom',
            'config' => [],
            'active' => true,
        ]);

        $response = $this->actingAs($this->user)->deleteJson('/api/v1/payment-methods/'.$method->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('payment_methods', [
            'id' => $method->id,
        ]);
    }

    public function test_bulk_delete()
    {
        $method1 = PaymentMethod::factory()->create(['name' => 'T1', 'driver' => 'Custom1']);
        $method2 = PaymentMethod::factory()->create(['name' => 'T2', 'driver' => 'Custom2']);

        $response = $this->actingAs($this->user)->postJson('/api/v1/payment-methods/bulk', [
            'ids' => [$method1->id, $method2->id],
            'action' => 'delete',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('payment_methods', ['id' => $method1->id]);
        $this->assertDatabaseMissing('payment_methods', ['id' => $method2->id]);
    }
}
