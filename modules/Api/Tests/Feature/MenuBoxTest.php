<?php

namespace Juzaweb\Modules\Api\Tests\Feature;

use Juzaweb\Modules\Api\Providers\ApiServiceProvider;
use Juzaweb\Modules\Blog\Tests\TestCase;
use Juzaweb\Modules\Core\Models\User;

class MenuBoxTest extends TestCase
{
    protected function getPackageProviders($app): array
    {
        return array_merge(parent::getPackageProviders($app), [
            ApiServiceProvider::class,
        ]);
    }

    public function test_index_menu_boxes()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->getJson('/api/v1/menu-boxes');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'key',
                    'label',
                    'icon',
                    'priority',
                    'field',
                ],
            ],
            'success',
        ]);

        // Assert some known menu boxes exist
        $response->assertJsonFragment(['key' => 'post-categories']);
    }
}
