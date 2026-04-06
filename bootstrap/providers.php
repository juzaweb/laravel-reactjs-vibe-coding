<?php

use App\Providers\AppServiceProvider;
use Juzaweb\Modules\Api\Providers\ApiServiceProvider;
use Juzaweb\Modules\Blog\Providers\BlogServiceProvider;
use Juzaweb\Modules\Core\Providers\AdminServiceProvider;
use Juzaweb\Modules\Core\Providers\CoreServiceProvider;

return [
    CoreServiceProvider::class,
    ApiServiceProvider::class,
    BlogServiceProvider::class,
    AdminServiceProvider::class,
    AppServiceProvider::class,
];
