<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 *
 * @license    GNU V2
 */

namespace Juzaweb\Modules\Subscription\Contracts;

use Illuminate\Support\Collection;

interface Subscription
{
    public function registerDriver(string $name, callable $resolver): void;

    public function driver(string $name);

    public function drivers(): Collection;

    public function renderConfig(string $driver, array $config = []): string;

    public function feature(string $key, callable $callback): void;
}
