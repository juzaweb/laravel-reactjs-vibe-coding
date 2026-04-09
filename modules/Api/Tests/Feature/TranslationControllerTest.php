<?php

namespace Juzaweb\Modules\Api\Tests\Feature;

use Illuminate\Foundation\Testing\WithFaker;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Tests\TestCase;

class TranslationControllerTest extends TestCase
{
    use WithFaker;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        require_once __DIR__.'/../../../Core/helpers/functions.php';

        $this->user = User::factory()->create([
            'is_super_admin' => 1,
            'email_verified_at' => now(),
        ]);

        config(['auth.guards.api' => [
            'driver' => 'session',
            'provider' => 'users',
        ]]);
    }

    public function test_index_requires_auth()
    {
        $response = $this->getJson('/api/v1/translations/en');
        $response->assertStatus(401);
    }

    public function test_index_returns_translations()
    {
        $response = $this->actingAs($this->user, 'api')->withoutMiddleware()
            ->getJson('/api/v1/translations/en');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_update_requires_auth()
    {
        $response = $this->putJson('/api/v1/translations/en', [
            'group' => 'app',
            'namespace' => 'core',
            'key' => 'save',
            'value' => 'Lưu',
        ]);
        $response->assertStatus(401);
    }

    public function test_update_translation()
    {
        $response = $this->actingAs($this->user, 'api')->withoutMiddleware()
            ->putJson('/api/v1/translations/en', [
                'group' => 'app',
                'namespace' => 'core',
                'key' => 'save_test',
                'value' => 'Save Test',
            ]);

        $response->assertStatus(200)
            ->assertJson(['message' => __('core::translation.translation_updated_successfully')]);

        $this->assertDatabaseHas('language_lines', [
            'group' => 'app',
            'namespace' => 'core',
            'key' => 'save_test',
        ]);
    }

    public function test_translate_status_requires_auth()
    {
        $response = $this->postJson('/api/v1/translations/status', [
            'history_ids' => [1],
        ]);
        $response->assertStatus(401);
    }

    public function test_translate_status()
    {
        $response = $this->actingAs($this->user, 'api')->withoutMiddleware()
            ->postJson('/api/v1/translations/status', [
                'history_ids' => [1],
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'completed',
                    'total',
                    'pending',
                    'success',
                    'failed',
                    'status',
                ],
            ]);
    }
}
