<?php

namespace Juzaweb\Modules\DevTool\Tests;

use Juzaweb\Modules\Core\Facades\Module;
use Juzaweb\Modules\Core\Facades\Theme;
use Juzaweb\Modules\Core\Providers\CoreServiceProvider;
use Juzaweb\Modules\DevTool\Providers\DevToolServiceProvider;
use Juzaweb\QueryCache\QueryCacheServiceProvider;
use Orchestra\Testbench\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function getPackageProviders($app)
    {
        return [
            QueryCacheServiceProvider::class,
            CoreServiceProvider::class,
            DevToolServiceProvider::class,
        ];
    }

    protected function getPackageAliases($app)
    {
        return [
            'Theme' => Theme::class,
            'Module' => Module::class,
        ];
    }
}
