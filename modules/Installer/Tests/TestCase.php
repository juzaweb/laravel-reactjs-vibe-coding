<?php

namespace Juzaweb\Modules\Installer\Tests;

use Illuminate\Foundation\Application;
use Juzaweb\Modules\Installer\Providers\InstallerServiceProvider;
use Tests\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
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
            ...parent::getPackageProviders($app),
            InstallerServiceProvider::class,
        ];
    }
}
