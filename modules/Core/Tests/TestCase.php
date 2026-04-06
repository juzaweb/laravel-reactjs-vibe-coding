<?php

namespace Juzaweb\Modules\Core\Tests;

use Illuminate\Foundation\Application;
use Juzaweb\Hooks\HooksServiceProvider;
use Juzaweb\Modules\Api\Providers\ApiServiceProvider;
use Juzaweb\Modules\Api\Providers\RouteServiceProvider;
use Juzaweb\Modules\Core\Contracts\ThemeSetting;
use Juzaweb\Modules\Core\Facades\Chart;
use Juzaweb\Modules\Core\Facades\Field;
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
    protected function setUp(): void
    {
        $this->createDummyTheme();

        parent::setUp();

        $this->createMixManifest();

        // Create class aliases for backward compatibility
        if (! class_exists('Juzaweb\Modules\Core\Models\User')) {
            class_alias(
                'Juzaweb\Modules\Core\Models\User',
                'Juzaweb\Modules\Core\Models\User'
            );
        }

        // Factory class is now in Core namespace - just create alias for backward compat
        if (! class_exists('Juzaweb\Modules\Admin\Database\Factories\UserFactory')) {
            class_alias(
                'Juzaweb\Modules\Core\Database\Factories\UserFactory',
                'Juzaweb\Modules\Admin\Database\Factories\UserFactory'
            );
        }

        // UserStatus enum is now in Core namespace - create alias for backward compat
        if (! enum_exists('Juzaweb\Modules\Core\Enums\UserStatus')) {
            class_alias(
                'Juzaweb\Modules\Core\Enums\UserStatus',
                'Juzaweb\Modules\Core\Enums\UserStatus'
            );
        }

        $this->app[ThemeSetting::class]->set('setup', 1);
    }

    protected function createMixManifest(): void
    {
        $path = public_path('juzaweb');
        if (! is_dir($path)) {
            mkdir($path, 0777, true);
        }
        if (! file_exists($path.'/mix-manifest.json')) {
            file_put_contents($path.'/mix-manifest.json', '{}');
        }
    }

    protected function createDummyTheme(): void
    {
        $path = __DIR__.'/themes/itech';
        if (! is_dir($path)) {
            mkdir($path, 0777, true);
        }
        if (! file_exists($path.'/theme.json')) {
            file_put_contents($path.'/theme.json', json_encode([
                'name' => 'itech',
                'title' => 'Itech Theme',
                'version' => '1.0',
                'require' => [],
            ]));
        }
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
            'Field' => Field::class,
            'Module' => Module::class,
            'Theme' => Theme::class,
            'Widget' => Widget::class,
            'Sidebar' => Sidebar::class,
            'PageTemplate' => PageTemplate::class,
            'PageBlock' => PageBlock::class,
            'Chart' => Chart::class,
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

        // Use MySQL if DB_CONNECTION is set (e.g., in CI), otherwise use SQLite
        $connection = env('DB_CONNECTION', 'sqlite');

        if ($connection === 'mysql') {
            $app['config']->set('database.default', 'mysql');
            $app['config']->set('database.connections.mysql', [
                'driver' => 'mysql',
                'host' => env('DB_HOST', '127.0.0.1'),
                'port' => env('DB_PORT', '3306'),
                'database' => env('DB_DATABASE', 'testing'),
                'username' => env('DB_USERNAME', 'root'),
                'password' => env('DB_PASSWORD', ''),
                'charset' => 'utf8mb4',
                'collation' => 'utf8mb4_unicode_ci',
                'prefix' => '',
                'strict' => true,
            ]);
        } else {
            // Setup default database to use sqlite :memory:
            $app['config']->set('database.default', 'testbench');
            $app['config']->set('database.connections.testbench', [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
            ]);
        }

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

        $this->loadLaravelMigrations(['--database' => $connection]);

        // Load package migrations
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        $this->artisan('migrate', ['--database' => $connection])->run();
    }
}
