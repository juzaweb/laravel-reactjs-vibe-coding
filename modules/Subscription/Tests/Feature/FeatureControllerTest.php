<?php

namespace Juzaweb\Modules\Subscription\Tests\Feature;

use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Subscription\Enums\FeatureType;
use Juzaweb\Modules\Subscription\Facades\Subscription;
use Juzaweb\Modules\Subscription\Tests\TestCase;

class FeatureControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->actingAs($this->user);
        $this->withoutMiddleware();
    }

    public function test_can_list_subscription_features()
    {
        Subscription::feature('test_feature', function () {
            return [
                'label' => 'Test Feature',
                'type' => FeatureType::BOOLEAN,
                'description' => 'A test feature',
            ];
        });

        $response = $this->getJson('/api/v1/subscription/features');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'label',
                    'type',
                    'description',
                ],
            ],
        ]);

        $features = collect($response->json('data'));

        $this->assertTrue($features->contains('label', 'Test Feature'));
    }
}
