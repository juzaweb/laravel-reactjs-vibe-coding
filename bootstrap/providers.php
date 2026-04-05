<?php

use App\Providers\AppServiceProvider;
use Juzaweb\Modules\Admin\Providers\AdminServiceProvider;
use Juzaweb\Modules\Core\Providers\CoreServiceProvider;

return [
    CoreServiceProvider::class,
    AdminServiceProvider::class,
    AppServiceProvider::class,
];
