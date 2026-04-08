<?php

namespace Juzaweb\Modules\Api\Tests\Feature;

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
        $response->assertJsonStructure([
            'data' => [
                'test_code_1'
            ],
            'success',
        ]);
    }

    public function test_update()
    {
        $setting = Setting::create(['code' => 'test_code_4', 'value' => 'test_value_4']);

        $data = [
            'code' => 'test_code_4',
            'value' => 'test_value_4_updated',
        ];

        $response = $this->putJson('/api/v1/settings/'.$setting->code, $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('settings', ['code' => 'test_code_4', 'value' => 'test_value_4_updated']);
    }
}
