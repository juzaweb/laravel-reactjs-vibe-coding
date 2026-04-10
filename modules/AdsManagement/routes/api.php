<?php

use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\AdsManagement\Http\Controllers\BannerAdsController;
use Juzaweb\Modules\AdsManagement\Http\Controllers\VideoAdsController;

Route::prefix('app')->group(function () {
    Route::get('banner-ads', [Juzaweb\Modules\AdsManagement\Http\Controllers\App\BannerAdsController::class, 'index']);
});

Route::group(['middleware' => ['auth:api']], function () {
    Route::api('video-ads', VideoAdsController::class);
    Route::api('banner-ads', BannerAdsController::class);
});
