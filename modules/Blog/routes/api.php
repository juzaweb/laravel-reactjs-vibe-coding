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

use Juzaweb\Modules\Blog\Http\Controllers\CategoryController;
use Juzaweb\Modules\Blog\Http\Controllers\PostController;

Route::prefix('app')->group(function () {
    Route::get('categories/{slug}', [Juzaweb\Modules\Blog\Http\Controllers\App\CategoryController::class, 'show']);
    Route::get('posts', [Juzaweb\Modules\Blog\Http\Controllers\App\PostController::class, 'index']);
    Route::get('posts/{slug}', [Juzaweb\Modules\Blog\Http\Controllers\App\PostController::class, 'show']);
});

Route::middleware('auth:api')->group(function () {
    Route::api('posts', PostController::class);
    Route::api('categories', CategoryController::class);
});
