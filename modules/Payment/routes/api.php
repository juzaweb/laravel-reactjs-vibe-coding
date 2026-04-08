<?php

use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\Payment\Http\Controllers\API\OrderController;
use Juzaweb\Modules\Payment\Http\Controllers\API\PaymentMethodController;

Route::middleware('auth:api')->group(function () {
    Route::api('orders', OrderController::class);
    Route::api('payment-methods', PaymentMethodController::class);
});
