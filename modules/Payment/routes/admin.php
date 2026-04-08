<?php

use Juzaweb\Modules\Payment\Http\Controllers\MethodController;
use Juzaweb\Modules\Payment\Http\Controllers\OrderController;
use Juzaweb\Modules\Payment\Http\Controllers\PaymentHistoryController;

Route::get('payment-methods/{driver}/get-data', [MethodController::class, 'getData']);

Route::admin('orders', OrderController::class)->except(['create', 'store']);
Route::admin('payment-methods', MethodController::class);
Route::admin('payment-histories', PaymentHistoryController::class)->except(['create', 'store', 'edit', 'update', 'destroy']);
