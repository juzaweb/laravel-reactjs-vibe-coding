<?php

use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Juzaweb\Modules\Core\Application;
use Juzaweb\Modules\Core\Http\Middleware\Authenticate;
use Juzaweb\Modules\Core\Http\Middleware\Captcha;
use Juzaweb\Modules\Core\Http\Middleware\EnsureEmailIsVerified;
use Juzaweb\Modules\Core\Http\Middleware\ForceJsonResponse;
use Juzaweb\Modules\Core\Http\Middleware\ForceSchemeUrl;
use Juzaweb\Modules\Core\Http\Middleware\ValidateSignature;
use Laravel\Passport\Http\Middleware\CheckTokenForAnyScope;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(
        function (Middleware $middleware) {
            $middleware->appendToGroup('api', ForceJsonResponse::class);

            $middleware->alias([
                'auth' => Authenticate::class,
                'verified' => EnsureEmailIsVerified::class,
                'captcha' => Captcha::class,
                'signed' => ValidateSignature::class,
                'scope' => CheckTokenForAnyScope::class,
            ]);

            $middleware->append(ForceSchemeUrl::class);
        }
    )
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
