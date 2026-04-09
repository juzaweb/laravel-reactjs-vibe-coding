<?php

namespace Juzaweb\Modules\Installer\Tests\Unit;

use Juzaweb\Modules\Installer\Tests\TestCase;

class HelperFunctionsTest extends TestCase
{
    /** @test */
    public function is_active_function_exists(): void
    {
        $this->assertTrue(function_exists('isActive'));
    }

    /** @test */
    public function is_active_returns_class_name_for_matching_route(): void
    {
        $this->get(route('installer.welcome'));

        $result = isActive('installer.welcome');

        $this->assertEquals('active', $result);
    }

    /** @test */
    public function is_active_returns_empty_string_for_non_matching_route(): void
    {
        $this->get(route('installer.welcome'));

        $result = isActive('installer.requirements');

        $this->assertEquals('', $result);
    }

    /** @test */
    public function is_active_returns_custom_class_name(): void
    {
        $this->get(route('installer.welcome'));

        $result = isActive('installer.welcome', 'current');

        $this->assertEquals('current', $result);
    }

    /** @test */
    public function is_active_works_with_array_of_routes(): void
    {
        $this->get(route('installer.welcome'));

        $result = isActive(['installer.welcome', 'installer.requirements']);

        $this->assertEquals('active', $result);
    }
}
