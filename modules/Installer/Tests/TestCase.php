<?php

namespace Juzaweb\Modules\Installer\Tests;

use Orchestra\Testbench\TestCase as Orchestra;
use Juzaweb\Modules\Installer\Providers\InstallerServiceProvider;

abstract class TestCase extends Orchestra
{
    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Get package providers.
     *
     * @param  \Illuminate\Foundation\Application  $app
     * @return array<int, class-string>
     */
    protected function getPackageProviders($app): array
    {
        return [
            \Juzaweb\Modules\Core\Providers\CoreServiceProvider::class,
            \Juzaweb\QueryCache\QueryCacheServiceProvider::class,
            InstallerServiceProvider::class,
        ];
    }

    protected function getPackageAliases($app): array
    {
        return [
            'Field' => \Juzaweb\Modules\Core\Facades\Field::class,
            'Module' => \Juzaweb\Modules\Core\Facades\Module::class,
            'Theme' => \Juzaweb\Modules\Core\Facades\Theme::class,
            'Widget' => \Juzaweb\Modules\Core\Facades\Widget::class,
            'Sidebar' => \Juzaweb\Modules\Core\Facades\Sidebar::class,
            'PageTemplate' => \Juzaweb\Modules\Core\Facades\PageTemplate::class,
            'PageBlock' => \Juzaweb\Modules\Core\Facades\PageBlock::class,
            'Chart' => \Juzaweb\Modules\Core\Facades\Chart::class,
            'Breadcrumb' => \Juzaweb\Modules\Core\Facades\Breadcrumb::class,
        ];
    }

    /**
     * Define environment setup.
     *
     * @param  \Illuminate\Foundation\Application  $app
     * @return void
     */
    protected function getEnvironmentSetUp($app): void
    {
        // Setup default database to use sqlite :memory:
        $app['config']->set('database.default', 'testbench');
        $app['config']->set('database.connections.testbench', [
            'driver'   => 'sqlite',
            'database' => ':memory:',
            'prefix'   => '',
        ]);
    }

    /**
     * Define database migrations.
     *
     * @return void
     */
    protected function defineDatabaseMigrations(): void
    {
        $this->loadLaravelMigrations(['--database' => 'testbench']);

        $this->loadMigrationsFrom(__DIR__ . '/../vendor/juzaweb/core/database/migrations');

        // Create users table for testing
        $this->artisan('migrate', ['--database' => 'testbench'])->run();
    }
}
