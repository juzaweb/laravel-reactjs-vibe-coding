<?php

use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\Payment\Http\Controllers\CartController;
use Juzaweb\Modules\Payment\Http\Controllers\OrderController;
use Juzaweb\Modules\Payment\Http\Controllers\PaymentController;
use Juzaweb\Modules\Payment\Http\Controllers\PaymentHistoryController;
use Juzaweb\Modules\Payment\Http\Controllers\PaymentMethodController;

Route::post('payment/{module}/checkout', [PaymentController::class, 'checkout'])->name('api.payment.checkout');
Route::post('payment/{module}/purchase', [PaymentController::class, 'purchase'])->name('api.payment.purchase');
Route::post('payment/{module}/return/{paymentHistoryId}', [PaymentController::class, 'return'])->name('api.payment.return');
Route::post('payment/{module}/cancel/{paymentHistoryId}', [PaymentController::class, 'cancel'])->name('api.payment.cancel');
Route::post('payment/{module}/status/{paymentHistoryId}', [PaymentController::class, 'status'])->name('api.payment.status');

Route::post('cart/add', [CartController::class, 'add'])->name('api.cart.add');
Route::delete('cart/{itemId}', [CartController::class, 'remove'])->name('api.cart.remove');

Route::middleware('auth:api')->group(function () {
    Route::api('orders', OrderController::class);
    Route::get('payment-methods/drivers', [PaymentMethodController::class, 'drivers']);
    Route::api('payment-methods', PaymentMethodController::class);
    Route::api('payment-histories', PaymentHistoryController::class)->only(['index', 'show']);
});
