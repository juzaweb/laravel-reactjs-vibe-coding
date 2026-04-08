<?php

use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\Subscription\Http\Controllers\PlanController;
use Juzaweb\Modules\Subscription\Http\Controllers\SubscriptionController;
use Juzaweb\Modules\Subscription\Http\Controllers\SubscriptionHistoryController;
use Juzaweb\Modules\Subscription\Http\Controllers\SubscriptionMethodController;

Route::get('subscription/methods', [SubscriptionMethodController::class, 'index']);

Route::middleware('auth:api')->group(
    function () {
        Route::api('subscription/plans', PlanController::class);

        Route::get('subscription/subscriptions', [SubscriptionController::class, 'index']);
        Route::get('subscription/histories', [SubscriptionHistoryController::class, 'index']);

        Route::post('subscription/{module}/subscribe', [SubscriptionController::class, 'subscribe']);
        Route::get('subscription/{module}/return/{transactionId}', [SubscriptionController::class, 'return']);
        Route::get('subscription/{module}/cancel/{transactionId}', [SubscriptionController::class, 'cancel']);
    }
);

Route::post('subscription/{method}/webhook', [SubscriptionController::class, 'webhook'])
    ->name('subscription.webhook');
