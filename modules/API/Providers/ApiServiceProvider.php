<?php

namespace Juzaweb\Modules\Api\Providers;

use Illuminate\Auth\RequestGuard;
use Illuminate\Contracts\Encryption\Encrypter;
use Illuminate\Support\Facades\Auth;
use Juzaweb\Modules\Api\Auth\JuzawebApiGuard;
use Juzaweb\Modules\Api\Commands\GenerateApiKeyCommand;
use Juzaweb\Modules\Core\Providers\ServiceProvider;
use Laravel\Passport\ClientRepository;
use Laravel\Passport\Passport;
use Laravel\Passport\PassportUserProvider;
use League\OAuth2\Server\ResourceServer;

class ApiServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Passport::tokensExpireIn(now()->addDays(15));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));

        Passport::viewPrefix('api::passport');

        Auth::extend('juzaweb', function ($app, $name, array $config) {
            $guard = new RequestGuard(
                new JuzawebApiGuard(
                    $app->make(ResourceServer::class),
                    new PassportUserProvider(
                        Auth::createUserProvider($config['provider'] ?? null),
                        $config['provider'] ?? 'users'
                    ),
                    $app->make(ClientRepository::class),
                    $app->make(Encrypter::class)
                ),
                $app['request']
            );

            $app->refresh('request', $guard, 'setRequest');

            return $guard;
        });

        $this->commands([
            GenerateApiKeyCommand::class,
        ]);
    }

    public function register(): void
    {
        $this->registerTranslations();
        $this->registerViews();
        $this->loadMigrationsFrom(__DIR__.'/../Database/migrations');
        $this->app->register(RouteServiceProvider::class);
    }

    protected function registerTranslations(): void
    {
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'api');
        $this->loadJsonTranslationsFrom(__DIR__.'/../resources/lang');
    }

    protected function registerViews(): void
    {
        $viewPath = resource_path('views/modules/api');

        $sourcePath = __DIR__.'/../resources/views';

        $this->publishes([
            $sourcePath => $viewPath,
        ], ['views', 'api-module-views']);

        $this->loadViewsFrom($sourcePath, 'api');
    }
}
