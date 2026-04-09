<?php

/**
 * JUZAWEB CMS - The Best CMS for Laravel Project
 *
 * @package    juzaweb/cms
 * @author     The Anh Dang <dangtheanh16@gmail.com>
 * @link       https://github.com/juzaweb/cms
 * @license    MIT
 */

namespace Juzaweb\Modules\Installer\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\Installer\Helpers\Intaller;

class Installed
{
    public function handle($request, Closure $next)
    {
        if (!Intaller::alreadyInstalled()) {
            if (!str_contains(Route::currentRouteName(), 'installer.')) {
                return redirect()->route('installer.welcome');
            }
        }

        return $next($request);
    }
}
