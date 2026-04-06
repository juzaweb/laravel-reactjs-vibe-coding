<?php

use Juzaweb\Modules\Api\Http\Controllers\API\MediaController;
use Juzaweb\Modules\Api\Http\Controllers\API\NotificationController;
use Juzaweb\Modules\Api\Http\Controllers\API\PageController;
use Juzaweb\Modules\Api\Http\Controllers\API\ProfileController;
use Juzaweb\Modules\Api\Http\Controllers\API\RoleController;
use Juzaweb\Modules\Api\Http\Controllers\API\SettingController;
use Juzaweb\Modules\Api\Http\Controllers\API\TranslationController;
use Juzaweb\Modules\Api\Http\Controllers\API\UserController;
use Juzaweb\Modules\Api\Http\Controllers\Auth\AuthController;
use Juzaweb\Modules\Api\Http\Controllers\Auth\SocialLoginController;
use Illuminate\Support\Facades\Route;

Route::get('settings', [SettingController::class, 'index']);
Route::get('translations/{locale}', [TranslationController::class, 'index']);

Route::middleware('auth:api')->group(function () {
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::put('profile/password', [ProfileController::class, 'updatePassword']);

    Route::get('notifications', [NotificationController::class, 'index']);
    Route::api('pages', PageController::class);
    Route::api('roles', RoleController::class);
    Route::api('users', UserController::class);
    Route::api('media', MediaController::class);
});

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
