<?php

use Illuminate\Support\Facades\Route;

if (class_exists('Juzaweb\Modules\Payment\Http\Controllers\CheckoutController')) {
    Route::get('checkout/{module}/{cartId}', ['Juzaweb\Modules\Payment\Http\Controllers\CheckoutController', 'index'])
        ->name('checkout');
    Route::post('checkout/{module}/{cartId}', ['Juzaweb\Modules\Payment\Http\Controllers\CheckoutController', 'index']);

    Route::get('invoices/{orderId}', ['Juzaweb\Modules\Payment\Http\Controllers\CheckoutController', 'thankyou'])
        ->name('checkout.thankyou');
}
