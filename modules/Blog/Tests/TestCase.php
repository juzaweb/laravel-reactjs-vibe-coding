<?php

namespace Juzaweb\Modules\Blog\Tests;

use Illuminate\Foundation\Application;
use Juzaweb\Hooks\HooksServiceProvider;
use Juzaweb\Modules\Blog\Providers\BlogServiceProvider;
use Juzaweb\Modules\Core\Facades\Chart;
use Juzaweb\Modules\Core\Facades\Module;
use Juzaweb\Modules\Core\Facades\PageBlock;
use Juzaweb\Modules\Core\Facades\PageTemplate;
use Juzaweb\Modules\Core\Facades\Sidebar;
use Juzaweb\Modules\Core\Facades\Theme;
use Juzaweb\Modules\Core\Facades\Widget;
use Juzaweb\Modules\Core\Permissions\PermissionServiceProvider;
use Juzaweb\Modules\Core\Providers\CoreServiceProvider;
use Juzaweb\Modules\Core\Translations\TranslationsServiceProvider;
use Juzaweb\QueryCache\QueryCacheServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;
use Pion\Laravel\ChunkUpload\Providers\ChunkUploadServiceProvider;
use Spatie\Activitylog\ActivitylogServiceProvider;

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
            BlogServiceProvider::class,
            QueryCacheServiceProvider::class,
            ActivitylogServiceProvider::class,
            HooksServiceProvider::class,
            TranslationsServiceProvider::class,
            PermissionServiceProvider::class,
            ChunkUploadServiceProvider::class,
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
            'Chart' => Chart::class,
        ];
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
