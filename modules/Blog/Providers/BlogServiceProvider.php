<?php

namespace Juzaweb\Modules\Blog\Providers;

use Juzaweb\Modules\Blog\Models\Category;
use Juzaweb\Modules\Blog\Models\CategoryTranslation;
use Juzaweb\Modules\Blog\Models\PostTranslation;
use Juzaweb\Modules\Core\Contracts\Sitemap;
use Juzaweb\Modules\Core\Facades\Menu;
use Juzaweb\Modules\Core\Facades\MenuBox;
use Juzaweb\Modules\Core\Providers\ServiceProvider;

class BlogServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->app[Sitemap::class]->register('post-categories', CategoryTranslation::class);
        $this->app[Sitemap::class]->register('posts', PostTranslation::class);

        $this->registerMenus();
    }

    public function register(): void
    {
        $this->registerTranslations();
        $this->registerConfig();
        $this->loadMigrationsFrom(__DIR__.'/../Database/migrations');
        $this->app->register(RouteServiceProvider::class);
    }

    protected function registerMenus(): void
    {
        Menu::make('blog', function () {
            return [
                'title' => __('blog::translation.blog'),
                'icon' => 'fas fa-newspaper',
            ];
        });

        Menu::make('posts', function () {
            return [
                'title' => __('blog::translation.posts'),
                'parent' => 'blog',
            ];
        });

        Menu::make('post-categories', function () {
            return [
                'title' => __('blog::translation.categories'),
                'parent' => 'blog',
            ];
        });

        Menu::make('comments', function () {
            return [
                'title' => __('blog::translation.comments'),
                'parent' => 'blog',
            ];
        });

        MenuBox::make('post-categories', Category::class, function () {
            return [
                'label' => __('core::translation.categories'),
                'icon' => 'fas fa-newspaper',
                'priority' => 1,
                'field' => 'name',
            ];
        });
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
