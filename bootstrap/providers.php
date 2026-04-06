<?php

use App\Providers\AppServiceProvider;
use Juzaweb\Modules\Api\Providers\ApiServiceProvider;
use Juzaweb\Modules\Core\Providers\AdminServiceProvider;
use Juzaweb\Modules\Core\Providers\CoreServiceProvider;

return [
    CoreServiceProvider::class,
    ApiServiceProvider::class,
    AdminServiceProvider::class,
    AppServiceProvider::class,
];
