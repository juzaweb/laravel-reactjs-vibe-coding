<?php

namespace Juzaweb\Modules\Api\Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Juzaweb\Modules\Core\Models\Setting;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Tests\TestCase;

class AppSettingControllerTest extends TestCase
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

    public function test_update()
    {
        $data = [
            'title' => 'Test App Site Name Updated',
        ];

        $response = $this->postJson('/api/v1/app/settings', $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('settings', ['code' => 'title']);
    }
}
