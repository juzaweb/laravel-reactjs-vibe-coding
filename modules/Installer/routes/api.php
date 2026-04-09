<?php

/**
 * JUZAWEB CMS - The Best CMS for Laravel Project
 *
 * @author     The Anh Dang <dangtheanh16@gmail.com>
 *
 * @link       https://github.com/juzaweb/cms
 *
 * @license    MIT
 */

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'api/v1/install',
    'namespace' => 'Juzaweb\Modules\Installer\Http\Controllers\Api',
    'middleware' => ['api', 'install'],
], function () {
    Route::get('environment', 'InstallerController@environment');
    Route::post('environment', 'InstallerController@saveEnvironment');

    Route::get('requirements', 'InstallerController@requirements');
    Route::get('permissions', 'InstallerController@permissions');

    Route::post('database', 'InstallerController@database');
    Route::post('admin', 'InstallerController@admin');
    Route::post('final', 'InstallerController@final');
});
