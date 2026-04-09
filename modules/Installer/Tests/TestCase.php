<?php

namespace Juzaweb\Modules\Installer\Tests;

use Illuminate\Foundation\Application;
use Juzaweb\Modules\Core\Providers\CoreServiceProvider;
use Juzaweb\Modules\Installer\Providers\InstallerServiceProvider;
use Juzaweb\QueryCache\QueryCacheServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

abstract class TestCase extends Orchestra
{
    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Get package providers.
     *
     * @param  Application  $app
     * @return array<int, class-string>
     */
    protected function getPackageProviders($app): array
    {
        return [
            CoreServiceProvider::class,
            QueryCacheServiceProvider::class,
            InstallerServiceProvider::class,
        ];
    }
}
