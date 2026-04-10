<?php

use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\Subscription\Http\Controllers\App\SubscriptionMethodController;
use Juzaweb\Modules\Subscription\Http\Controllers\FeatureController;
use Juzaweb\Modules\Subscription\Http\Controllers\PlanController;
use Juzaweb\Modules\Subscription\Http\Controllers\SubscriptionController;
use Juzaweb\Modules\Subscription\Http\Controllers\SubscriptionHistoryController;

Route::get('app/subscription/methods', [SubscriptionMethodController::class, 'index']);
Route::get('app/subscription/plans', [Juzaweb\Modules\Subscription\Http\Controllers\App\PlanController::class, 'index']);

Route::middleware('auth:api')->group(
    function () {
        Route::get('subscription/features', [FeatureController::class, 'index']);
        Route::get('subscription/methods/drivers', [Juzaweb\Modules\Subscription\Http\Controllers\SubscriptionMethodController::class, 'drivers']);
        Route::api('subscription/methods', Juzaweb\Modules\Subscription\Http\Controllers\SubscriptionMethodController::class);
        Route::api('subscription/plans', PlanController::class);

        Route::get('subscription/subscriptions', [SubscriptionController::class, 'index']);
        Route::get('subscription/histories', [SubscriptionHistoryController::class, 'index']);

        Route::post('app/subscription/subscribe', [Juzaweb\Modules\Subscription\Http\Controllers\App\SubscriptionController::class, 'subscribe']);
        Route::post('app/subscription/return/{transactionId}', [Juzaweb\Modules\Subscription\Http\Controllers\App\SubscriptionController::class, 'return']);
        Route::post('app/subscription/cancel/{transactionId}', [Juzaweb\Modules\Subscription\Http\Controllers\App\SubscriptionController::class, 'cancel']);
    }
);

Route::post('subscription/{method}/webhook', [Juzaweb\Modules\Subscription\Http\Controllers\App\SubscriptionController::class, 'webhook'])
    ->name('subscription.webhook');
