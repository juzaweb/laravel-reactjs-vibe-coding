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
Route::group([
    'prefix' => 'install',
    'namespace' => 'Juzaweb\Modules\Installer\Http\Controllers',
    'middleware' => ['web', 'install'],
], function () {
    Route::get('/', 'WelcomeController@welcome')->name('installer.welcome');
    Route::get('/environment', 'EnvironmentController@environment')->name('installer.environment');

    Route::post('/environment', 'EnvironmentController@save')->name('installer.environment.save');

    Route::get('/requirements', 'RequirementsController@requirements')->name('installer.requirements');

    Route::get('/permissions', 'PermissionsController@permissions')->name('installer.permissions');

    Route::get('/database', 'DatabaseController@database')->name('installer.database');

    Route::get('/admin', 'AdminController@index')->name('installer.admin');

    Route::post('/admin', 'AdminController@save')->name('installer.admin.save');

    Route::get('final', 'FinalController@finish')->name('installer.final');
});
