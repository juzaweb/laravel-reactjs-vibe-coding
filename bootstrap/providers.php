<?php

use App\Providers\AppServiceProvider;
use Juzaweb\Modules\API\Providers\ApiServiceProvider;
use Juzaweb\Modules\Core\Providers\AdminServiceProvider;
use Juzaweb\Modules\Core\Providers\CoreServiceProvider;
use Juzaweb\Modules\DevTool\Providers\DevToolServiceProvider;
use Juzaweb\Modules\Installer\Providers\InstallerServiceProvider;

return [
    CoreServiceProvider::class,
    ApiServiceProvider::class,
    DevToolServiceProvider::class,
    AdminServiceProvider::class,
    AppServiceProvider::class,
    InstallerServiceProvider::class,
];
