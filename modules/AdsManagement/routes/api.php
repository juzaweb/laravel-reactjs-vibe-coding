<?php

use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\AdsManagement\Http\Controllers\BannerAdsController;
use Juzaweb\Modules\AdsManagement\Http\Controllers\VideoAdsController;

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

Route::api('banner-ads', BannerAdsController::class);
Route::api('video-ads', VideoAdsController::class);
