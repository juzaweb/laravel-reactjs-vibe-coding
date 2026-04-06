<?php

use Juzaweb\Modules\Api\Http\Controllers\API\NotificationController;
use Juzaweb\Modules\Api\Http\Controllers\API\PageController;
use Juzaweb\Modules\Api\Http\Controllers\API\ProfileController;
use Juzaweb\Modules\Api\Http\Controllers\API\SettingController;
use Juzaweb\Modules\Api\Http\Controllers\API\TranslationController;

Route::get('settings', [SettingController::class, 'index']);
Route::get('translations/{locale}', [TranslationController::class, 'index']);

Route::middleware('auth:api')->group(function () {
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::put('profile/password', [ProfileController::class, 'updatePassword']);

    Route::get('notifications', [NotificationController::class, 'index']);
    Route::apiResource('pages', PageController::class);
});
