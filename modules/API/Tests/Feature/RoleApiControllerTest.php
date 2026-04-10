<?php

namespace Juzaweb\Modules\Api\Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Permissions\Models\Role;
use Juzaweb\Modules\Core\Tests\TestCase;

class RoleApiControllerTest extends TestCase
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

    public function test_index_roles_api(): void
    {
        Role::create([
            'name' => 'API Role Test 1',
            'code' => 'api-role-test-1',
            'guard_name' => 'web',
        ]);

        $response = $this->getJson('/api/v1/roles');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'code',
                        'name',
                    ],
                ],
                'success',
            ])
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_show_role_api(): void
    {
        $role = Role::create([
            'name' => 'API Role Show',
            'code' => 'api-role-show',
            'guard_name' => 'web',
        ]);

        $response = $this->getJson('/api/v1/roles/'.$role->id);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'code',
                    'name',
                ],
                'success',
            ])
            ->assertJsonPath('data.id', $role->id);
    }

    public function test_store_role_api(): void
    {
        $response = $this->postJson('/api/v1/roles', [
            'name' => 'API New Role',
            'code' => 'api-new-role',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('roles', [
            'name' => 'API New Role',
            'code' => 'api-new-role',
        ]);
    }

    public function test_update_role_api(): void
    {
        $role = Role::create([
            'name' => 'API Old Role',
            'code' => 'api-old-role',
            'guard_name' => 'web',
        ]);

        $response = $this->putJson('/api/v1/roles/'.$role->id, [
            'name' => 'API Updated Role',
            'code' => 'api-old-role',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
            'name' => 'API Updated Role',
        ]);
    }

    public function test_destroy_role_api(): void
    {
        $role = Role::create([
            'name' => 'API Delete Role',
            'code' => 'api-delete-role',
            'guard_name' => 'web',
        ]);

        $response = $this->deleteJson('/api/v1/roles/'.$role->id);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseMissing('roles', [
            'id' => $role->id,
        ]);
    }
}
