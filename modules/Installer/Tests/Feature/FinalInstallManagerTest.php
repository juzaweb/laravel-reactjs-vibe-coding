<?php

namespace Juzaweb\Modules\Installer\Tests\Feature;

use Juzaweb\Modules\Installer\Helpers\FinalInstallManager;
use Orchestra\Testbench\TestCase;
use Mockery;

class FinalInstallManagerTest extends TestCase
{
    protected function getPackageProviders($app)
    {
        return [
            \Juzaweb\Modules\Installer\Providers\InstallerServiceProvider::class,
            \Juzaweb\Modules\Core\Providers\CoreServiceProvider::class,
            \Juzaweb\QueryCache\QueryCacheServiceProvider::class,
        ];
    }

    protected function getPackageAliases($app)
    {
        return [
            'Field' => \Juzaweb\Modules\Core\Facades\Field::class,
            'Module' => \Juzaweb\Modules\Core\Facades\Module::class,
            'Theme' => \Juzaweb\Modules\Core\Facades\Theme::class,
            'Widget' => \Juzaweb\Modules\Core\Facades\Widget::class,
            'Sidebar' => \Juzaweb\Modules\Core\Facades\Sidebar::class,
            'PageTemplate' => \Juzaweb\Modules\Core\Facades\PageTemplate::class,
            'PageBlock' => \Juzaweb\Modules\Core\Facades\PageBlock::class,
            'Chart' => \Juzaweb\Modules\Core\Facades\Chart::class,
        ];
    }

    public function testGenerateKeySkippedIfKeyExists()
    {
        // Set a dummy key
        config(['app.key' => 'base64:dummykey']);
        config(['installer.final.key' => true]);

        $kernel = Mockery::mock(\Illuminate\Contracts\Console\Kernel::class);
        $this->app->instance(\Illuminate\Contracts\Console\Kernel::class, $kernel);

        // Expect key:generate to NOT be called
        $kernel->shouldReceive('call')
            ->never()
            ->with('key:generate', ['--force' => true], Mockery::any());

        // Expect other calls
        $kernel->shouldReceive('call')->with('vendor:publish', Mockery::any(), Mockery::any());
        $kernel->shouldReceive('call')->with('storage:link', Mockery::any(), Mockery::any());

        $manager = new FinalInstallManager();
        $manager->runFinal();
    }

    public function testGenerateKeyIsCalledIfKeyMissing()
    {
        // Set key to null
        config(['app.key' => null]);
        config(['installer.final.key' => true]);

        $kernel = Mockery::mock(\Illuminate\Contracts\Console\Kernel::class);
        $this->app->instance(\Illuminate\Contracts\Console\Kernel::class, $kernel);

        // Expect key:generate to be called
        $kernel->shouldReceive('call')
            ->once()
            ->with('key:generate', ['--force' => true], Mockery::any());

        // Expect other calls
        $kernel->shouldReceive('call')->with('vendor:publish', Mockery::any(), Mockery::any());
        $kernel->shouldReceive('call')->with('storage:link', Mockery::any(), Mockery::any());

        $manager = new FinalInstallManager();
        $manager->runFinal();
    }
}
