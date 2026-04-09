<?php

namespace Juzaweb\Modules\Installer\Providers;

use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use Juzaweb\Modules\Installer\Commands\InstallCommand;
use Juzaweb\Modules\Installer\Http\Middleware\CanInstall;
use Juzaweb\Modules\Installer\Http\Middleware\Installed;

class InstallerServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->publishFiles();
        $this->loadRoutesFrom(__DIR__ . '/../routes/web.php');
        $this->mergeConfigFrom(
            __DIR__ . '/../config/installer.php',
            'installer'
        );

        $this->commands([
            InstallCommand::class,
        ]);
    }

    /**
     * Bootstrap the application events.
     *
     * @param \Illuminate\Routing\Router $router
     */
    public function boot(Router $router): void
    {
        $router->aliasMiddleware('install', CanInstall::class);
        $router->pushMiddlewareToGroup('theme', Installed::class);
        $router->pushMiddlewareToGroup('admin', Installed::class);
    }

    /**
     * Publish config file for the installer.
     *
     * @return void
     */
    protected function publishFiles(): void
    {
        $this->publishes([
            __DIR__ . '/../config/installer.php' => base_path('config/installer.php'),
        ], 'installer_config');
    }
}
