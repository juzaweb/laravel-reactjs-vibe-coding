<?php

namespace Juzaweb\Modules\Installer\Http\Middleware;

use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Juzaweb\Modules\Installer\Helpers\Intaller;

class CanInstall
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @return RedirectResponse|mixed
     */
    public function handle($request, Closure $next)
    {
        if (Intaller::alreadyInstalled()) {
            return redirect()->to('/admin');
        }

        return $next($request);
    }
}
