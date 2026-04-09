<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 *
 * @license    GNU V2
 */

namespace Juzaweb\Modules\Subscription\Providers;

use Illuminate\Support\Facades\File;
use Juzaweb\Modules\Core\Providers\ServiceProvider;
use Juzaweb\Modules\Subscription\Contracts\Subscription;
use Juzaweb\Modules\Subscription\Methods\PayPal;
use Juzaweb\Modules\Subscription\Services\SubscriptionManager;
use Juzaweb\Modules\Subscription\Services\TestSubscription;

class SubscriptionServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->booted(
            function () {
                if (File::missing(storage_path('app/installed'))) {
                    return;
                }
            }
        );

        $this->app[Subscription::class]->registerDriver(
            'PayPal',
            function () {
                return new PayPal;
            }
        );

        $this->app[Subscription::class]->registerModule(
            'test',
            function () {
                return new TestSubscription;
            }
        );
    }

    public function register(): void
    {
        $this->registerTranslations();
        $this->loadMigrationsFrom(__DIR__.'/../Database/migrations');
        $this->app->register(RouteServiceProvider::class);

        $this->app->singleton(
            Subscription::class,
            function ($app) {
                return new SubscriptionManager($app);
            }
        );
    }

    /**
     * Register translations.
     */
    protected function registerTranslations(): void
    {
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'subscription');
        $this->loadJsonTranslationsFrom(__DIR__.'/../resources/lang');
    }
}
