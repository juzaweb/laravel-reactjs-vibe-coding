<?php

namespace Juzaweb\Modules\DevTool\Tests\Unit;

use Juzaweb\Modules\DevTool\Tests\TestCase;

class UnUseCommandTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->app['config']->set('modules.paths.modules', base_path('modules'));
    }

    public function test_it_unuses_module()
    {
        $this->artisan('module:unuse')
            ->assertExitCode(0);
    }
}
