<?php

namespace Juzaweb\Modules\Installer\Tests\Feature;

use Juzaweb\Modules\Installer\Tests\TestCase;

class InstallerRoutesTest extends TestCase
{
    /** @test */
    public function it_can_access_welcome_page(): void
    {
        $response = $this->get(route('installer.welcome'));

        $response->assertStatus(200);
        $response->assertViewIs('installer::welcome');
    }

    /** @test */
    public function it_can_access_requirements_page(): void
    {
        $response = $this->get(route('installer.requirements'));

        $response->assertStatus(200);
        $response->assertViewIs('installer::requirements');
    }

    /** @test */
    public function it_can_access_permissions_page(): void
    {
        $response = $this->get(route('installer.permissions'));

        $response->assertStatus(200);
        $response->assertViewIs('installer::permissions');
    }

    /** @test */
    public function it_can_access_environment_page(): void
    {
        $response = $this->get(route('installer.environment'));

        $response->assertStatus(200);
        $response->assertViewIs('installer::environment');
    }
}
