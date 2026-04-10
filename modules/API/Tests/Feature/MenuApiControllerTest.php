<?php

namespace Juzaweb\Modules\Api\Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Juzaweb\Modules\Core\Models\Menus\Menu;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Tests\TestCase;

class MenuApiControllerTest extends TestCase
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

        $this->withoutMiddleware();
        $this->actingAs($this->user, 'api');
    }

    public function test_index_menus_api(): void
    {
        Menu::create([
            'name' => 'API Menu Test 1',
        ]);

        $response = $this->getJson('/api/v1/menus');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'created_at',
                        'updated_at',
                    ],
                ],
                'success',
            ])
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_show_menu_api(): void
    {
        $menu = Menu::create([
            'name' => 'API Menu Show',
        ]);

        $response = $this->getJson('/api/v1/menus/'.$menu->id);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'created_at',
                    'updated_at',
                ],
                'success',
            ])
            ->assertJsonPath('data.id', $menu->id);
    }

    public function test_store_menu_api(): void
    {
        $response = $this->postJson('/api/v1/menus', [
            'name' => 'API New Menu',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('menus', [
            'name' => 'API New Menu',
        ]);
    }

    public function test_update_menu_api(): void
    {
        $menu = Menu::create([
            'name' => 'API Old Menu',
        ]);

        $response = $this->putJson('/api/v1/menus/'.$menu->id, [
            'name' => 'API Updated Menu',
            'content' => [['label' => 'Home']],
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('menus', [
            'id' => $menu->id,
            'name' => 'API Updated Menu',
        ]);
    }

    public function test_destroy_menu_api(): void
    {
        $menu = Menu::create([
            'name' => 'API Delete Menu',
        ]);

        $response = $this->deleteJson('/api/v1/menus/'.$menu->id);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseMissing('menus', [
            'id' => $menu->id,
        ]);
    }
}
