<?php

namespace Juzaweb\Modules\Api\Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Tests\TestCase;
use Juzaweb\Modules\Core\Translations\Enums\TranslateHistoryStatus;
use Juzaweb\Modules\Core\Translations\Models\LanguageLine;
use Juzaweb\Modules\Core\Translations\Models\TranslateHistory;

class TranslationApiControllerTest extends TestCase
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

    public function test_collection()
    {
        $response = $this->getJson('/api/v1/translations/en/collection');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'namespace',
                        'group',
                        'key',
                        'trans',
                    ],
                ],
            ]);
    }

    public function test_update()
    {
        $response = $this->putJson('/api/v1/translations/en', [
            'namespace' => 'core',
            'group' => 'app',
            'key' => 'test_key',
            'value' => 'Test Value',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('language_lines', [
            'namespace' => 'core',
            'group' => 'app',
            'key' => 'test_key',
        ]);

        $line = LanguageLine::where('namespace', 'core')->where('group', 'app')->where('key', 'test_key')->first();
        $this->assertEquals('Test Value', $line->text['en']);
    }

    public function test_translate_status()
    {
        $history = TranslateHistory::create([
            'translateable_type' => 'App\Models\Post',
            'translateable_id' => 1,
            'locale' => 'vi',
            'status' => TranslateHistoryStatus::PENDING,
        ]);

        $response = $this->postJson('/api/v1/translations/translate-status', [
            'history_ids' => [$history->id],
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'completed',
                    'total',
                    'pending',
                    'success',
                    'failed',
                    'status',
                ],
            ]);

        $response->assertJsonPath('data.total', 1);
        $response->assertJsonPath('data.pending', 1);
    }
}
