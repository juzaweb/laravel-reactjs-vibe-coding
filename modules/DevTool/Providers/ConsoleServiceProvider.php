<?php

namespace Juzaweb\Modules\DevTool\Providers;

use Illuminate\Support\ServiceProvider;
use Juzaweb\Modules\Core\Modules\Support\Stub;

class ConsoleServiceProvider extends ServiceProvider
{
    /**
     * The available commands
     * @var array
     */
    protected array $commands = [
        \Juzaweb\Modules\DevTool\Commands\PublishAgentsCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\CommandMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\ControllerMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\DumpCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\EventMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\JobMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\ListenerMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\MailMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\MiddlewareMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\NotificationMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\ProviderMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\RouteProviderMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\ModuleDeleteCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\ModuleMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Databases\FactoryMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\PolicyMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\RequestMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\RuleMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateRefreshCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateResetCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateFreshCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateRollbackCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateStatusCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrationMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\ModelMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\ModelShowCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\PublishCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\PublishConfigurationCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\PublishMigrationCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\PublishTranslationCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Databases\SeedCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Databases\SeedMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\SetupCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\UnUseCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\UseCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\ResourceMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\TestMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\ComponentClassMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\ComponentViewMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\DatatableMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Cruds\AdminCrudMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Cruds\APICrudMakeCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Modules\Cruds\CrudMakeCommand::class,
        // Theme commands
        \Juzaweb\Modules\DevTool\Commands\Themes\DownloadStyleCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Themes\DownloadTemplateCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Themes\MakeControllerCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Themes\MakePageBlockCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Themes\MakeTemplateCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Themes\MakeViewCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Themes\MakeWidgetCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Themes\ThemeGeneratorCommand::class,
        \Juzaweb\Modules\DevTool\Commands\Themes\ThemeSeedCommand::class,
    ];

    public function boot()
    {
        $this->setupStubPath();
        $this->registerNamespaces();
    }

    public function register(): void
    {
        $this->commands($this->commands);
    }

    /**
     * Setup stub path.
     */
    public function setupStubPath()
    {
        $path = $this->app['config']->get('dev-tool.modules.stubs.path');

        Stub::setBasePath($path);

        // $this->app->booted(function ($app) {
        //     /** @var RepositoryInterface $moduleRepository */
        //     $moduleRepository = $app[RepositoryInterface::class];
        //     if ($moduleRepository->config('stubs.enabled') === true) {
        //         Stub::setBasePath($moduleRepository->config('stubs.path'));
        //     }
        // });
    }

    public function provides(): array
    {
        return $this->commands;
    }

    /**
     * Register package's namespaces.
     */
    protected function registerNamespaces()
    {
        $stubsPath = dirname(__DIR__, 2) . '/stubs';

        $this->publishes([
            $stubsPath => resource_path('stubs'),
        ], 'stubs');
    }
}
