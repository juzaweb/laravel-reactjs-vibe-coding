<?php

namespace Juzaweb\Modules\Installer\Tests\Feature;

use Juzaweb\Modules\Installer\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EnvironmentPostTest extends TestCase
{
    protected function defineDatabaseMigrations(): void
    {
        // Do nothing to prevent migrations from running
    }

    /** @test */
    public function it_validates_required_database_fields(): void
    {
        $response = $this->post(route('installer.environment.save'), []);

        $response->assertSessionHasErrors([
            'database_hostname',
            'database_port',
            'database_name',
            'database_username',
        ]);
    }

    /** @test */
    public function it_validates_database_port_is_numeric(): void
    {
        $response = $this->post(route('installer.environment.save'), [
            'database_hostname' => 'localhost',
            'database_port' => 'not-a-number',
            'database_name' => 'test_db',
            'database_username' => 'root',
        ]);

        $response->assertSessionHasErrors(['database_port']);
    }

    /** @test */
    public function it_validates_max_length_for_database_fields(): void
    {
        $response = $this->post(route('installer.environment.save'), [
            'database_hostname' => str_repeat('a', 151),
            'database_port' => 3306,
            'database_name' => str_repeat('b', 151),
            'database_username' => str_repeat('c', 151),
        ]);

        $response->assertSessionHasErrors([
            'database_hostname',
            'database_name',
            'database_username',
        ]);
    }

    /** @test */
    public function it_allows_nullable_database_password(): void
    {
        // Mock database connection to avoid actual connection
        DB::shouldReceive('purge')->once();
        DB::shouldReceive('connection->getPdo')->once()->andReturn(true);

        $response = $this->post(route('installer.environment.save'), [
            'database_hostname' => 'localhost',
            'database_port' => 3306,
            'database_name' => 'test_db',
            'database_username' => 'root',
            'database_password' => null,
        ]);

        // Should not have password validation error
        $response->assertSessionDoesntHaveErrors(['database_password']);
    }

    /** @test */
    public function it_redirects_back_on_validation_failure(): void
    {
        $response = $this->post(route('installer.environment.save'), [
            'database_hostname' => '',
        ]);

        $response->assertRedirect(route('installer.environment'));
        $response->assertSessionHasErrors();
    }

    /** @test */
    public function it_preserves_input_on_validation_failure(): void
    {
        $data = [
            'database_hostname' => 'localhost',
            'database_port' => 'invalid',
            'database_name' => 'test_db',
            'database_username' => 'root',
        ];

        $response = $this->post(route('installer.environment.save'), $data);

        $response->assertRedirect(route('installer.environment'));
        $response->assertSessionHasInput('database_hostname', 'localhost');
    }

    /** @test */
    public function it_redirects_to_database_page_on_success(): void
    {
        // Mock successful database connection
        DB::shouldReceive('purge')->once();
        DB::shouldReceive('connection->getPdo')->once()->andReturn(true);

        $response = $this->post(route('installer.environment.save'), [
            'database_hostname' => 'localhost',
            'database_port' => 3306,
            'database_name' => 'test_db',
            'database_username' => 'root',
            'database_password' => 'password',
        ]);

        $response->assertRedirect(route('installer.database'));
    }

    /** @test */
    public function it_fails_with_invalid_database_connection(): void
    {
        // Mock failed database connection
        DB::shouldReceive('purge')->once();
        DB::shouldReceive('connection->getPdo')->once()->andThrow(new \Exception('Connection failed'));

        $response = $this->post(route('installer.environment.save'), [
            'database_hostname' => 'invalid-host',
            'database_port' => 3306,
            'database_name' => 'test_db',
            'database_username' => 'root',
            'database_password' => 'wrong-password',
        ]);

        $response->assertRedirect(route('installer.environment'));
        $response->assertSessionHasErrors(['database_connection']);
    }

    /** @test */
    public function it_accepts_valid_database_credentials(): void
    {
        // Mock successful database connection
        DB::shouldReceive('purge')->once();
        DB::shouldReceive('connection->getPdo')->once()->andReturn(true);

        $response = $this->post(route('installer.environment.save'), [
            'database_hostname' => '127.0.0.1',
            'database_port' => 3306,
            'database_name' => 'juzaweb_test',
            'database_username' => 'root',
            'database_password' => '',
        ]);

        $response->assertRedirect(route('installer.database'));
        $response->assertSessionDoesntHaveErrors();
    }

    /** @test */
    public function it_saves_environment_file_on_success(): void
    {
        // Mock successful database connection
        DB::shouldReceive('purge')->once();
        DB::shouldReceive('connection->getPdo')->once()->andReturn(true);

        $response = $this->post(route('installer.environment.save'), [
            'database_hostname' => 'localhost',
            'database_port' => 3306,
            'database_name' => 'test_db',
            'database_username' => 'root',
            'database_password' => 'secret',
        ]);

        $response->assertRedirect(route('installer.database'));
        $response->assertSessionHas('results');
    }
}
