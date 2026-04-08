<?php

namespace Juzaweb\Modules\Blog\Providers;

use Juzaweb\Modules\Blog\Models\CategoryTranslation;
use Juzaweb\Modules\Blog\Models\PostTranslation;
use Juzaweb\Modules\Core\Contracts\Sitemap;
use Juzaweb\Modules\Core\Providers\ServiceProvider;

class BlogServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->app[Sitemap::class]->register('post-categories', CategoryTranslation::class);
        $this->app[Sitemap::class]->register('posts', PostTranslation::class);
    }

    public function register(): void
    {
        $this->registerTranslations();
        $this->registerConfig();
        $this->loadMigrationsFrom(__DIR__.'/../Database/migrations');
        $this->app->register(RouteServiceProvider::class);
    }

    protected function registerConfig(): void
    {
        $this->publishes([
            __DIR__.'/../config/blog.php' => config_path('blog.php'),
        ], 'blog-config');
        $this->mergeConfigFrom(__DIR__.'/../config/blog.php', 'blog');
    }

    protected function registerTranslations(): void
    {
        $this->loadJsonTranslationsFrom(__DIR__.'/../resources/lang');
    }
}
