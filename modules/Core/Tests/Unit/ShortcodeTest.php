<?php

namespace Juzaweb\Modules\Core\Tests\Unit;

use Juzaweb\Modules\Core\Tests\TestCase;
use Juzaweb\Modules\Core\Traits\HasContent;
use Pingpong\Shortcode\ShortcodeFacade as Shortcode;
use Pingpong\Shortcode\ShortcodeServiceProvider;

class ShortcodeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->app->register(ShortcodeServiceProvider::class);
    }

    public function test_render_content_compiles_shortcodes()
    {
        // Register a shortcode
        Shortcode::register('test', function ($shortcode) {
            return 'Replaced Content';
        });

        // Create a dummy object using the trait
        $model = new class
        {
            use HasContent;

            public $content;

            public function __construct()
            {
                $this->content = 'Start [test] End';
            }
        };

        // Call renderContent
        // Expect failure initially as shortcode logic isn't implemented yet
        $result = $model->renderContent();

        // Verification logic (adjusted for expectation of failure first)
        // If logic is NOT implemented, it will return "Start [test] End" (wrapped in HTML tags potentially by str_get_html)
        // We assert that it *should* contain "Replaced Content"
        $this->assertStringContainsString('Replaced Content', $result);
        $this->assertStringNotContainsString('[test]', $result);
    }
}
