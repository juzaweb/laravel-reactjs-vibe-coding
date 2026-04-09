<?php

namespace Juzaweb\Modules\AdsManagement\Providers;

use Juzaweb\Modules\AdsManagement\Ads;
use Juzaweb\Modules\AdsManagement\AdsRepository;
use Juzaweb\Modules\Core\Providers\ServiceProvider;

class AdManagementServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        //
    }

    public function register(): void
    {
        $this->registerTranslations();
        $this->registerConfig();
        $this->loadMigrationsFrom(__DIR__.'/../Database/migrations');
        $this->app->register(RouteServiceProvider::class);

        $this->app->singleton(Ads::class, AdsRepository::class);
    }

    protected function registerConfig(): void
    {
        $this->publishes([
            __DIR__.'/../config/ad-management.php' => config_path('ad-management.php'),
        ], 'ad-management-config');
        $this->mergeConfigFrom(__DIR__.'/../config/ad-management.php', 'ad-management');
    }

    protected function registerTranslations(): void
    {
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'ad-management');
    }
}
