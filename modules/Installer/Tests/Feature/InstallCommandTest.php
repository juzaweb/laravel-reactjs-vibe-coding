<?php

namespace Juzaweb\Modules\Installer\Tests\Feature;

use Juzaweb\Modules\Installer\Tests\TestCase;
use Juzaweb\Modules\Installer\Helpers\DatabaseManager;
use Juzaweb\Modules\Installer\Helpers\FinalInstallManager;
use Juzaweb\Modules\Installer\Helpers\InstalledFileManager;
use Mockery;

class InstallCommandTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Mock dependencies to prevent actual execution of these parts
        $this->mock(DatabaseManager::class, function ($mock) {
            $mock->shouldReceive('run')->once();
        });

        $this->mock(FinalInstallManager::class, function ($mock) {
            $mock->shouldReceive('runFinal')->once();
        });

        $this->mock(InstalledFileManager::class, function ($mock) {
            $mock->shouldReceive('update')->once();
        });
    }

    public function test_install_command_with_options()
    {
        $this->artisan('juzaweb:install', [
            '--name' => 'Test User',
            '--email' => 'test@example.com',
            '--password' => 'password123',
        ])
            ->expectsOutput('Juzaweb CMS Installtion')
            ->expectsOutput('-- Database Install')
            ->expectsOutput('-- Publish assets')
            ->expectsOutput('-- Create user admin')
            ->expectsOutput('-- Update installed')
            ->expectsOutput('Juzaweb CMS Install Successfully !!!')
            ->assertExitCode(0);

        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'is_super_admin' => 1,
        ]);
    }

    public function test_install_command_interactive()
    {
        $this->artisan('juzaweb:install')
            ->expectsQuestion('Full Name?', 'Interactive User')
            ->expectsQuestion('Email?', 'interactive@example.com')
            ->expectsQuestion('Password?', 'password123')
            ->expectsOutput('Juzaweb CMS Installtion')
            ->assertExitCode(0);

        $this->assertDatabaseHas('users', [
            'name' => 'Interactive User',
            'email' => 'interactive@example.com',
        ]);
    }

    public function test_install_command_validation_failure_and_retry()
    {
        $this->artisan('juzaweb:install', [
            '--name' => 'Test User',
            '--email' => 'invalid-email',
            '--password' => 'password123',
        ])
            ->expectsQuestion('Email?', 'valid@example.com')
            ->assertExitCode(0);

        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'valid@example.com',
        ]);
    }

    public function test_install_command_with_all_invalid_options_prompts_user()
    {
        $this->artisan('juzaweb:install', [
            '--name' => '', // Empty name (required)
            '--email' => 'invalid-email', // Invalid email
            '--password' => 'short', // Min 6
        ])
            ->expectsQuestion('Full Name?', 'Valid Name')
            ->expectsQuestion('Email?', 'valid@example.com')
            ->expectsQuestion('Password?', 'password123')
            ->assertExitCode(0);

        $this->assertDatabaseHas('users', [
            'name' => 'Valid Name',
            'email' => 'valid@example.com',
        ]);
    }
}
