<?php

namespace Juzaweb\Modules\API\Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Juzaweb\Modules\Core\Models\Setting;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Tests\TestCase;

class SettingControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'is_super_admin' => 1,
            'email_verified_at' => now(),
        ]);

        config(['auth.guards.api' => [
            'driver' => 'session',
            'provider' => 'users',
        ]]);

        $this->actingAs($this->user, 'api');
    }

    public function test_index()
    {
        Setting::create(['code' => 'test_code_1', 'value' => 'test_value_1']);

        $response = $this->getJson('/api/v1/settings');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'success']);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.test_code_1', 'test_value_1');
    }

    public function test_update()
    {
        Setting::create(['code' => 'test_code_4', 'value' => 'test_value_4']);
        Setting::create(['code' => 'test_code_5', 'value' => 'test_value_5']);

        $data = [
            'settings' => [
                'test_code_4' => 'test_value_4_updated',
                'test_code_5' => 'test_value_5_updated',
            ],
        ];

        $response = $this->putJson('/api/v1/settings', $data);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.test_code_4', 'test_value_4_updated');
        $response->assertJsonPath('data.test_code_5', 'test_value_5_updated');
        $this->assertDatabaseHas('settings', ['code' => 'test_code_4', 'value' => 'test_value_4_updated']);
        $this->assertDatabaseHas('settings', ['code' => 'test_code_5', 'value' => 'test_value_5_updated']);
    }
}
