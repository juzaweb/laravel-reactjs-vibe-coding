<?php

namespace Tests;

use Illuminate\Foundation\Application;
use Juzaweb\Hooks\HooksServiceProvider;
use Juzaweb\Modules\Api\Providers\ApiServiceProvider;
use Juzaweb\Modules\Api\Providers\RouteServiceProvider;
use Juzaweb\Modules\Core\Facades\Menu;
use Juzaweb\Modules\Core\Facades\Module;
use Juzaweb\Modules\Core\Facades\PageBlock;
use Juzaweb\Modules\Core\Facades\PageTemplate;
use Juzaweb\Modules\Core\Facades\Sidebar;
use Juzaweb\Modules\Core\Facades\Theme;
use Juzaweb\Modules\Core\Facades\Widget;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Permissions\PermissionServiceProvider;
use Juzaweb\Modules\Core\Providers\CoreServiceProvider;
use Juzaweb\Modules\Core\Themes\Activators\SettingActivator;
use Juzaweb\Modules\Core\Translations\TranslationsServiceProvider;
use Juzaweb\QueryCache\QueryCacheServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;
use Pion\Laravel\ChunkUpload\Providers\ChunkUploadServiceProvider;
use Spatie\Activitylog\ActivitylogServiceProvider;

abstract class TestCase extends Orchestra
{
    use CreatesApplication;

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
            ActivitylogServiceProvider::class,
            HooksServiceProvider::class,
            TranslationsServiceProvider::class,
            PermissionServiceProvider::class,
            ChunkUploadServiceProvider::class,
            ApiServiceProvider::class,
            RouteServiceProvider::class,
        ];
    }

    /**
     * Get package aliases.
     *
     * @param  Application  $app
     */
    protected function getPackageAliases($app): array
    {
        return [
            'Module' => Module::class,
            'Theme' => Theme::class,
            'Widget' => Widget::class,
            'Sidebar' => Sidebar::class,
            'PageTemplate' => PageTemplate::class,
            'PageBlock' => PageBlock::class,
            'Menu' => Menu::class,
        ];
    }

    /**
     * Define environment setup.
     *
     * @param  Application  $app
     */
    protected function getEnvironmentSetUp($app): void
    {
        $app['config']->set('themes.path', __DIR__.'/themes');

        $app['config']->set('themes.activator', 'setting');
        $app['config']->set('themes.activators.setting.class', SettingActivator::class);

        $app['config']->set('database.default', 'testbench');
        $app['config']->set('database.connections.testbench', [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
        ]);

        // Setup filesystem disks for testing
        $app['config']->set('filesystems.disks.public', [
            'driver' => 'local',
            'root' => storage_path('app/public'),
        ]);

        $app['config']->set('filesystems.disks.private', [
            'driver' => 'local',
            'root' => storage_path('app/private'),
        ]);

        $app['config']->set('auth.providers.users.model', User::class);
    }

    /**
     * Define database migrations.
     */
    protected function defineDatabaseMigrations(): void
    {
        $connection = config('database.default');

        // Load package migrations
        $this->loadMigrationsFrom(__DIR__.'/../modules/Core/Database/migrations');

        $this->artisan('migrate', ['--database' => $connection])->run();
    }
}
