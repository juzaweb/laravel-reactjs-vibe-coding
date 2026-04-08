<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\Payment\Http\Controllers\API\OrderController;

Route::middleware('auth:api')->group(function () {
    Route::apiResource('orders', OrderController::class);
});
