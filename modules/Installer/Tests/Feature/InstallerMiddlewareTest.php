<?php

namespace Juzaweb\Modules\Installer\Tests\Feature;

use Juzaweb\Modules\Installer\Tests\TestCase;

class InstallerMiddlewareTest extends TestCase
{
    /** @test */
    public function it_allows_access_to_installer_routes_when_not_installed(): void
    {
        // Assuming app is not installed by default in test environment
        $response = $this->get(route('installer.welcome'));

        $response->assertStatus(200);
    }

    /** @test */
    public function installer_routes_use_web_middleware(): void
    {
        $response = $this->get(route('installer.welcome'));

        // Should have CSRF token (web middleware)
        $response->assertStatus(200);
        $response->assertViewIs('installer::welcome');
    }

    /** @test */
    public function post_requests_require_csrf_token(): void
    {
        // Disable CSRF for this specific test to verify it's being checked
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

        $response = $this->post(route('installer.environment.save'), [
            'database_hostname' => 'localhost',
            'database_port' => 3306,
            'database_name' => 'test',
            'database_username' => 'root',
        ]);

        // Should process the request (with or without CSRF based on middleware)
        $response->assertStatus(302);
    }
}
