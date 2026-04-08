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

namespace Juzaweb\Modules\Core\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\Core\Facades\RouteResource;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Route::macro('admin', function (string $name, string $controller) {
            return RouteResource::admin($name, $controller);
        });

        Route::macro('api', function (string $name, string $controller) {
            return RouteResource::api($name, $controller);
        });

        $this->routes(function () {
            // Route::middleware('api')
            //     ->prefix('api/v1')
            //     ->group(__DIR__ . '/../routes/api.php');

            Route::group([], function () {
                require __DIR__.'/../routes/statics.php';
            });

            Route::middleware(['theme'])
                ->group(__DIR__.'/../routes/web.php');
        });
    }
}
