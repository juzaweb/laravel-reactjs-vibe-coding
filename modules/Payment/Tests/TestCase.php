<?php

namespace Juzaweb\Modules\Payment\Tests;

use Tests\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Define database migrations.
     */
    protected function defineDatabaseMigrations(): void
    {
        $connection = config('database.default');

        parent::defineDatabaseMigrations();

        // Load package migrations
        $this->loadMigrationsFrom(__DIR__.'/../Database/migrations');

        $this->artisan('migrate', ['--database' => $connection])->run();
    }
}
