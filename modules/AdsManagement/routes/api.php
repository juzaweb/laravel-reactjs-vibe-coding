<?php

use Illuminate\Support\Facades\Route;

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

Route::api('banner-ads', \Juzaweb\Modules\AdsManagement\Http\Controllers\Api\BannerAdsController::class);
Route::api('video-ads', \Juzaweb\Modules\AdsManagement\Http\Controllers\Api\VideoAdsController::class);
