<?php

use Juzaweb\Modules\Payment\Http\Controllers\API\PaymentMethodController;

Route::apiResource('payment-methods', PaymentMethodController::class);
Route::post('payment-methods/bulk', [PaymentMethodController::class, 'bulk']);
