<?php

namespace Juzaweb\Modules\Blog\Tests\Feature;

use Juzaweb\Modules\Blog\Models\Category;
use Juzaweb\Modules\Blog\Tests\TestCase;
use Juzaweb\Modules\Core\Models\User;

class CategoryApiTest extends TestCase
{
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_index_categories()
    {
        Category::factory(3)->create();

        $response = $this->getJson('api/v1/categories');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'description',
                    'slug',
                    'parent_id',
                ],
            ],
            'meta',
            'links',
            'success',
        ]);
    }

    public function test_show_category()
    {
        $category = Category::factory()->create();

        $response = $this->getJson("api/v1/categories/{$category->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'description',
                'slug',
                'parent_id',
            ],
            'success',
        ]);
        $this->assertEquals($category->id, $response->json('data.id'));
    }

    public function test_show_category_not_found()
    {
        $response = $this->getJson('api/v1/categories/invalid-uuid-format-or-not-found');

        $response->assertStatus(404);
    }

    public function test_store_category()
    {
        $data = [
            'name' => 'New Test Category',
            'description' => 'Description for test category',
            'slug' => 'new-test-category',
            'locale' => 'en',
        ];

        $response = $this->postJson('api/v1/categories', $data);

        $response->assertStatus(200);
        $response->assertJsonStructure(['data' => ['id', 'name']]);

        $this->assertDatabaseHas('post_category_translations', [
            'name' => 'New Test Category',
        ]);
    }

    public function test_store_category_validation_error()
    {
        $data = [
            'description' => 'Missing name',
        ];

        $response = $this->postJson('api/v1/categories', $data);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    public function test_update_category()
    {
        $category = Category::factory()->create();

        $data = [
            'name' => 'Updated Category Name',
            'description' => 'Updated description',
        ];

        $response = $this->putJson("api/v1/categories/{$category->id}", $data);

        $response->assertStatus(200);

        $this->assertDatabaseHas('post_category_translations', [
            'post_category_id' => $category->id,
            'name' => 'Updated Category Name',
        ]);
    }

    public function test_update_category_not_found()
    {
        $data = [
            'name' => 'Valid Name',
        ];

        $response = $this->putJson('api/v1/categories/invalid-id-here', $data);

        $response->assertStatus(404);
    }

    public function test_update_category_validation_error()
    {
        $category = Category::factory()->create();

        $data = [
            // Missing name
        ];

        $response = $this->putJson("api/v1/categories/{$category->id}", $data);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    public function test_delete_category()
    {
        $category = Category::factory()->create();

        $response = $this->deleteJson("api/v1/categories/{$category->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('post_categories', [
            'id' => $category->id,
        ]);
    }

    public function test_delete_category_not_found()
    {
        $response = $this->deleteJson('api/v1/categories/invalid-id-here');

        $response->assertStatus(404);
    }

    public function test_bulk_delete_categories()
    {
        $categories = Category::factory(2)->create();
        $ids = $categories->pluck('id')->toArray();

        $response = $this->postJson('api/v1/categories/bulk', [
            'ids' => $ids,
            'action' => 'delete',
        ]);

        $response->assertStatus(200);

        foreach ($ids as $id) {
            $this->assertDatabaseMissing('post_categories', [
                'id' => $id,
            ]);
        }
    }

    public function test_bulk_action_validation_error()
    {
        $response = $this->postJson('api/v1/categories/bulk', [
            'action' => 'invalid_action',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['ids', 'action']);
    }
}
