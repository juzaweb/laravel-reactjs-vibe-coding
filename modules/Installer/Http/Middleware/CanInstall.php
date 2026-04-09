<?php

namespace Juzaweb\Modules\Installer\Http\Middleware;

use Closure;
use Juzaweb\Modules\Installer\Helpers\Intaller;

class CanInstall
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Illuminate\Http\RedirectResponse|mixed
     */
    public function handle($request, Closure $next)
    {
        if (Intaller::alreadyInstalled()) {
            return redirect()->to('/admin');
        }

        return $next($request);
    }
}
