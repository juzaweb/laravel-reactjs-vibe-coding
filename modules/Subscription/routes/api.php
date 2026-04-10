<?php

use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\Subscription\Http\Controllers\App\SubscriptionMethodController;
use Juzaweb\Modules\Subscription\Http\Controllers\PlanController;
use Juzaweb\Modules\Subscription\Http\Controllers\SubscriptionController;
use Juzaweb\Modules\Subscription\Http\Controllers\SubscriptionHistoryController;

Route::get('app/subscription/methods', [SubscriptionMethodController::class, 'index']);
Route::get('app/subscription/plans', [Juzaweb\Modules\Subscription\Http\Controllers\App\PlanController::class, 'index']);

Route::middleware('auth:api')->group(
    function () {
        Route::api('subscription/methods', Juzaweb\Modules\Subscription\Http\Controllers\SubscriptionMethodController::class);
        Route::api('subscription/plans', PlanController::class);

        Route::get('subscription/subscriptions', [SubscriptionController::class, 'index']);
        Route::get('subscription/histories', [SubscriptionHistoryController::class, 'index']);

        Route::post('subscription/{module}/subscribe', [SubscriptionController::class, 'subscribe']);
        Route::post('subscription/{module}/return/{transactionId}', [SubscriptionController::class, 'return']);
        Route::post('subscription/{module}/cancel/{transactionId}', [SubscriptionController::class, 'cancel']);
    }
);

Route::post('subscription/{method}/webhook', [SubscriptionController::class, 'webhook'])
    ->name('subscription.webhook');
