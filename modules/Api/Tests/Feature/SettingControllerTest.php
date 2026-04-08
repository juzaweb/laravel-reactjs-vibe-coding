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
            'data',
            'meta',
            'links',
            'success',
        ]);
    }

    public function test_show()
    {
        $setting = Setting::create(['code' => 'test_code_show', 'value' => 'test_value_show']);

        $response = $this->getJson('/api/v1/settings/'.$setting->id);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'code',
                'value',
            ],
            'success',
        ]);
    }

    public function test_store()
    {
        $data = [
            'title' => 'Test App Site Name Updated Store',
        ];

        $response = $this->postJson('/api/v1/settings', $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('settings', ['code' => 'title']);
    }

    public function test_update()
    {
        $setting = Setting::create(['code' => 'test_code_4', 'value' => 'test_value_4']);

        $data = [
            'code' => 'test_code_4_updated',
            'value' => 'test_value_4_updated',
        ];

        $response = $this->putJson('/api/v1/settings/'.$setting->id, $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('settings', ['code' => 'test_code_4_updated']);
    }
}
