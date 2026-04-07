<?php

use App\Providers\AppServiceProvider;
use Juzaweb\Modules\Api\Providers\ApiServiceProvider;
use Juzaweb\Modules\Core\Providers\AdminServiceProvider;
use Juzaweb\Modules\Core\Providers\CoreServiceProvider;
use Juzaweb\Modules\DevTool\Providers\DevToolServiceProvider;

return [
    CoreServiceProvider::class,
    ApiServiceProvider::class,
    DevToolServiceProvider::class,
    AdminServiceProvider::class,
    AppServiceProvider::class,
];
