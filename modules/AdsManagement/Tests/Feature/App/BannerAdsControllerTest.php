<?php

namespace Juzaweb\Modules\AdsManagement\Tests\Feature\App;

use Juzaweb\Modules\AdsManagement\Models\BannerAds;
use Juzaweb\Modules\AdsManagement\Tests\TestCase;
use Juzaweb\Modules\Core\Facades\Theme;

class BannerAdsControllerTest extends TestCase
{
    public function test_index()
    {
        $response = $this->getJson('/api/v1/app/banner-ads');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'active',
                    'url',
                    'size',
                    'type',
                    'views',
                    'click',
                    'body',
                    'position',
                    'created_at',
                    'updated_at',
                ],
            ],
            'meta',
            'links',
            'success',
        ]);
    }

    public function test_index_with_position()
    {
        $banner = BannerAds::factory()->create(['active' => true]);
        $banner->positions()->create([
            'position' => 'test_position',
            'theme' => Theme::current()->name(),
        ]);

        $response = $this->getJson('/api/v1/app/banner-ads?position=test_position');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'active',
                    'url',
                    'size',
                    'type',
                    'views',
                    'click',
                    'body',
                    'position',
                    'created_at',
                    'updated_at',
                ],
            ],
            'meta',
            'links',
            'success',
        ]);

        $this->assertGreaterThanOrEqual(1, count($response->json('data')));
    }
}
