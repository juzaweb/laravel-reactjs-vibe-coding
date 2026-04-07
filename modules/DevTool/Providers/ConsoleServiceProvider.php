<?php

namespace Juzaweb\Modules\DevTool\Providers;

use Illuminate\Support\ServiceProvider;
use Juzaweb\Modules\Core\Modules\Support\Stub;
use Juzaweb\Modules\DevTool\Commands\Modules\CommandMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\ComponentClassMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\ComponentViewMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\ControllerMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Cruds\AdminCrudMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Cruds\APICrudMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Cruds\CrudMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Databases\FactoryMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateFreshCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateRefreshCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateResetCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateRollbackCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrateStatusCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Databases\MigrationMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Databases\SeedCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\Databases\SeedMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\DatatableMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\DumpCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\EventMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\JobMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\ListenerMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\MailMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\MiddlewareMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\ModelMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\ModelShowCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\ModuleDeleteCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\ModuleMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\NotificationMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\PolicyMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\ProviderMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\PublishCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\PublishConfigurationCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\PublishMigrationCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\PublishTranslationCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\RequestMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\ResourceMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\RouteProviderMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\RuleMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\SetupCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\TestMakeCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\UnUseCommand;
use Juzaweb\Modules\DevTool\Commands\Modules\UseCommand;
use Juzaweb\Modules\DevTool\Commands\PublishAgentsCommand;
use Juzaweb\Modules\DevTool\Commands\Themes\DownloadStyleCommand;
use Juzaweb\Modules\DevTool\Commands\Themes\DownloadTemplateCommand;
use Juzaweb\Modules\DevTool\Commands\Themes\MakeControllerCommand;
use Juzaweb\Modules\DevTool\Commands\Themes\MakePageBlockCommand;
use Juzaweb\Modules\DevTool\Commands\Themes\MakeTemplateCommand;
use Juzaweb\Modules\DevTool\Commands\Themes\MakeViewCommand;
use Juzaweb\Modules\DevTool\Commands\Themes\MakeWidgetCommand;
use Juzaweb\Modules\DevTool\Commands\Themes\ThemeGeneratorCommand;
use Juzaweb\Modules\DevTool\Commands\Themes\ThemeSeedCommand;

class ConsoleServiceProvider extends ServiceProvider
{
    /**
     * The available commands
     */
    protected array $commands = [
        PublishAgentsCommand::class,
        CommandMakeCommand::class,
        ControllerMakeCommand::class,
        DumpCommand::class,
        EventMakeCommand::class,
        JobMakeCommand::class,
        ListenerMakeCommand::class,
        MailMakeCommand::class,
        MiddlewareMakeCommand::class,
        NotificationMakeCommand::class,
        ProviderMakeCommand::class,
        RouteProviderMakeCommand::class,
        ModuleDeleteCommand::class,
        ModuleMakeCommand::class,
        FactoryMakeCommand::class,
        PolicyMakeCommand::class,
        RequestMakeCommand::class,
        RuleMakeCommand::class,
        MigrateCommand::class,
        MigrateRefreshCommand::class,
        MigrateResetCommand::class,
        MigrateFreshCommand::class,
        MigrateRollbackCommand::class,
        MigrateStatusCommand::class,
        MigrationMakeCommand::class,
        ModelMakeCommand::class,
        ModelShowCommand::class,
        PublishCommand::class,
        PublishConfigurationCommand::class,
        PublishMigrationCommand::class,
        PublishTranslationCommand::class,
        SeedCommand::class,
        SeedMakeCommand::class,
        SetupCommand::class,
        UnUseCommand::class,
        UseCommand::class,
        ResourceMakeCommand::class,
        TestMakeCommand::class,
        ComponentClassMakeCommand::class,
        ComponentViewMakeCommand::class,
        DatatableMakeCommand::class,
        AdminCrudMakeCommand::class,
        APICrudMakeCommand::class,
        CrudMakeCommand::class,
        // Theme commands
        DownloadStyleCommand::class,
        DownloadTemplateCommand::class,
        MakeControllerCommand::class,
        MakePageBlockCommand::class,
        MakeTemplateCommand::class,
        MakeViewCommand::class,
        MakeWidgetCommand::class,
        ThemeGeneratorCommand::class,
        ThemeSeedCommand::class,
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
        $stubsPath = dirname(__DIR__, 2).'/stubs';

        $this->publishes([
            $stubsPath => resource_path('stubs'),
        ], 'stubs');
    }
}
