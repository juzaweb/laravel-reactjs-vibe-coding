<?php

use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\Api\Http\Controllers\App\SettingController as AppSettingController;
use Juzaweb\Modules\Api\Http\Controllers\Auth\AuthController;
use Juzaweb\Modules\Api\Http\Controllers\Auth\SocialLoginController;
use Juzaweb\Modules\Api\Http\Controllers\MediaController;
use Juzaweb\Modules\Api\Http\Controllers\MenuController;
use Juzaweb\Modules\Api\Http\Controllers\NotificationController;
use Juzaweb\Modules\Api\Http\Controllers\PageController;
use Juzaweb\Modules\Api\Http\Controllers\ProfileController;
use Juzaweb\Modules\Api\Http\Controllers\RoleController;
use Juzaweb\Modules\Api\Http\Controllers\SettingController;
use Juzaweb\Modules\Api\Http\Controllers\TranslationController;
use Juzaweb\Modules\Api\Http\Controllers\UserController;

Route::get('app/settings', [AppSettingController::class, 'index']);
Route::get('translations/{locale}', [TranslationController::class, 'index']);

Route::middleware('auth:api')->group(
    function () {
        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
        Route::put('profile/password', [ProfileController::class, 'updatePassword']);

        Route::api('notifications', NotificationController::class)->only(['index', 'show', 'destroy', 'bulk']);
        Route::put('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::get('pages/templates', [PageController::class, 'templates']);
        Route::api('pages', PageController::class);
        Route::api('roles', RoleController::class);
        Route::api('users', UserController::class);
        Route::post('media/chunk', [MediaController::class, 'chunk']);
        Route::api('media', MediaController::class);
        Route::api('menus', MenuController::class);

        // Handle form and update settings specifically for the settings page
        Route::get('settings/configs', [SettingController::class, 'configs'])->name('api.settings.configs');
        Route::put('settings', [SettingController::class, 'update'])->name('api.settings.update');
        Route::api('settings', SettingController::class)->only(['index']);
    }
);

Route::group(['prefix' => 'auth/user'], function () {
    Route::post('login', [AuthController::class, 'login'])->middleware('captcha');
    Route::post('refresh-token', [AuthController::class, 'refreshToken']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('resend-verification-email', [AuthController::class, 'resendVerificationEmail']);
    Route::post('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password/{token}', [AuthController::class, 'resetPassword']);

    Route::post('social/{driver}/redirect', [SocialLoginController::class, 'redirect'])
        ->name('api.user.social.redirect');
    Route::post('social/{driver}/callback', [SocialLoginController::class, 'callback'])
        ->name('api.user.social.callback');

    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
    });
});
