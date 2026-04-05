<?php

namespace Juzaweb\Modules\Blog\Tests;

use Orchestra\Testbench\TestCase as Orchestra;

abstract class TestCase extends Orchestra
{
    protected function setUp(): void
    {
        $this->createDummyTheme();

        parent::setUp();

        $this->createMixManifest();

        // Create class aliases for backward compatibility
        if (!class_exists('Juzaweb\Modules\Core\Models\User')) {
            class_alias(
                'Juzaweb\Modules\Core\Models\User',
                'Juzaweb\Modules\Core\Models\User'
            );
        }

        // Factory class is now in Core namespace - just create alias for backward compat
        if (!class_exists('Juzaweb\Modules\Admin\Database\Factories\UserFactory')) {
            class_alias(
                'Juzaweb\Modules\Core\Database\Factories\UserFactory',
                'Juzaweb\Modules\Admin\Database\Factories\UserFactory'
            );
        }

        // UserStatus enum is now in Core namespace - create alias for backward compat
        if (!enum_exists('Juzaweb\Modules\Core\Enums\UserStatus')) {
            class_alias(
                'Juzaweb\Modules\Core\Enums\UserStatus',
                'Juzaweb\Modules\Core\Enums\UserStatus'
            );
        }

        $this->app[\Juzaweb\Modules\Core\Contracts\ThemeSetting::class]->set('setup', 1);
    }

    protected function createMixManifest(): void
    {
        $path = public_path('juzaweb');
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }
        file_put_contents($path . '/mix-manifest.json', json_encode([
            '/js/admin.min.js' => '/js/admin.min.js',
            '/css/admin.min.css' => '/css/admin.min.css',
            '/css/vendor.min.css' => '/css/vendor.min.css',
            '/js/vendor.min.js' => '/js/vendor.min.js',
        ]));
    }

    protected function createDummyTheme(): void
    {
        $path = __DIR__ . '/themes/itech';
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }
        if (!file_exists($path . '/theme.json')) {
            file_put_contents($path . '/theme.json', json_encode([
                "name" => "itech",
                "title" => "Itech Theme",
                "version" => "1.0",
                "require" => []
            ]));
        }
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
            \Juzaweb\Modules\Blog\Providers\BlogServiceProvider::class,
            \Juzaweb\QueryCache\QueryCacheServiceProvider::class,
            \Spatie\Activitylog\ActivitylogServiceProvider::class,
            \Juzaweb\Hooks\HooksServiceProvider::class,
            \Juzaweb\Modules\Core\Translations\TranslationsServiceProvider::class,
            \Juzaweb\Modules\Core\Permissions\PermissionServiceProvider::class,
            \Pion\Laravel\ChunkUpload\Providers\ChunkUploadServiceProvider::class,
            \Yajra\DataTables\DataTablesServiceProvider::class,
            \Yajra\DataTables\ButtonsServiceProvider::class,
            \Yajra\DataTables\HtmlServiceProvider::class,
        ];
    }

    /**
     * Get package aliases.
     *
     * @param  \Illuminate\Foundation\Application  $app
     * @return array
     */
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
            'DataTables' => \Yajra\DataTables\Facades\DataTables::class,
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
        $app['config']->set('themes.path', __DIR__ . '/themes');

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
                'driver'   => 'sqlite',
                'database' => ':memory:',
                'prefix'   => '',
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

        $app['config']->set('app.locale', 'en');
        $app['config']->set('translatable.fallback_locale', 'en');
        $app['config']->set('auth.providers.users.model', \Juzaweb\Modules\Core\Models\User::class);
    }

    /**
     * Define database migrations.
     *
     * @return void
     */
    protected function defineDatabaseMigrations(): void
    {
        $connection = config('database.default');

        $this->loadLaravelMigrations(['--database' => $connection]);

        // Load package migrations
        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        $this->artisan('migrate', ['--database' => $connection])->run();
    }
}
