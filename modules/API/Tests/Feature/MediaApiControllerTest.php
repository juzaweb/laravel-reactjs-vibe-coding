<?php

namespace Juzaweb\Modules\API\Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Juzaweb\Modules\Core\Models\Media;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Tests\TestCase;

class MediaApiControllerTest extends TestCase
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

    public function test_chunk_upload_api(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('chunk_test_image.jpg')->size(100);

        // Upload first chunk (simulate part of file)
        $response = $this->post('/api/v1/media/chunk', [
            'file' => $file,
            'resumableChunkNumber' => 1,
            'resumableChunkSize' => 100,
            'resumableCurrentChunkSize' => 100,
            'resumableTotalSize' => 100,
            'resumableType' => 'image/jpeg',
            'resumableIdentifier' => 'test-identifier',
            'resumableFilename' => 'chunk_test_image.jpg',
            'resumableRelativePath' => 'chunk_test_image.jpg',
            'resumableTotalChunks' => 1,
        ]);

        $response->assertStatus(200);

        // The chunk upload should finish and return media data
        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
            ],
            'success',
        ]);

        $this->assertDatabaseHas('media', [
            'name' => 'chunk_test_image.jpg',
        ]);
    }
}
