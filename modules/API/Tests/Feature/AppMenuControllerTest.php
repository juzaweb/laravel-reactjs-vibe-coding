<?php

namespace Juzaweb\Modules\API\Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Juzaweb\Modules\Core\Models\Menus\Menu;
use Juzaweb\Modules\Core\Models\Menus\MenuItem;
use Juzaweb\Modules\Core\Tests\TestCase;

class AppMenuControllerTest extends TestCase
{
    use DatabaseTransactions;

    public function test_show_menu_with_items()
    {
        $menu = Menu::create([
            'id' => Str::uuid()->toString(),
            'name' => 'Main App Menu',
        ]);

        $item1 = MenuItem::create([
            'id' => Str::uuid()->toString(),
            'menu_id' => $menu->id,
            'label' => 'Home',
            'link' => '/',
            'display_order' => 1,
            'box_key' => 'custom',
            'locale' => 'en',
        ]);

        $item2 = MenuItem::create([
            'id' => Str::uuid()->toString(),
            'menu_id' => $menu->id,
            'label' => 'About',
            'link' => '/about',
            'display_order' => 2,
            'box_key' => 'custom',
            'locale' => 'en',
        ]);

        $child1 = MenuItem::create([
            'id' => Str::uuid()->toString(),
            'menu_id' => $menu->id,
            'parent_id' => $item1->id,
            'label' => 'Home Child',
            'link' => '/home/child',
            'display_order' => 1,
            'box_key' => 'custom',
            'locale' => 'en',
        ]);

        $response = $this->getJson("/api/v1/app/menus/{$menu->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $response->assertJsonPath('data.id', $menu->id);
        $response->assertJsonPath('data.name', 'Main App Menu');

        $response->assertJsonPath('data.items.0.id', $item1->id);
        $response->assertJsonPath('data.items.0.label', 'Home');
        $response->assertJsonPath('data.items.0.children.0.id', $child1->id);
        $response->assertJsonPath('data.items.0.children.0.label', 'Home Child');

        $response->assertJsonPath('data.items.1.id', $item2->id);
        $response->assertJsonPath('data.items.1.label', 'About');
    }
}
