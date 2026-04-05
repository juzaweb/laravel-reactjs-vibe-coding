<?php

use Illuminate\Support\Facades\Route;
use Juzaweb\Modules\Core\Facades\Theme;
use Juzaweb\Modules\Core\Http\Controllers\AddonController;
use Juzaweb\Modules\Core\Http\Controllers\SitemapController;

if (! Theme::current()) {
    Route::get('/', [AddonController::class, 'redirect']);
}

Route::get('sitemap.xml', [SitemapController::class, 'index'])
    ->name('sitemap.xml');

Route::get('sitemap/{page}.xml', [SitemapController::class, 'pages'])
    ->name('sitemap.pages')
    ->where('page', '[a-z0-9\-]+');

Route::get('sitemap/{provider}/page-{page}.xml', [SitemapController::class, 'provider'])
    ->name('sitemap.provider')
    ->where('provider', '[a-z0-9\-]+')
    ->where('page', '[0-9]+');
