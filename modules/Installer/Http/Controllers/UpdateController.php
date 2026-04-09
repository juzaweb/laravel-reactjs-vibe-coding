<?php

namespace Juzaweb\Modules\Installer\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\View\View;
use Juzaweb\Modules\Installer\Helpers\DatabaseManager;
use Juzaweb\Modules\Installer\Helpers\InstalledFileManager;
use Juzaweb\Modules\Installer\Helpers\MigrationsHelper;

class UpdateController extends Controller
{
    use MigrationsHelper;

    /**
     * Display the updater welcome page.
     *
     * @return View
     */
    public function welcome()
    {
        return view('installer::update.welcome');
    }

    /**
     * Display the updater overview page.
     *
     * @return View
     */
    public function overview()
    {
        $migrations = $this->getMigrations();
        $dbMigrations = $this->getExecutedMigrations();

        return view('installer::update.overview', ['numberOfUpdatesPending' => count($migrations) - count($dbMigrations)]);
    }

    /**
     * Migrate and seed the database.
     *
     * @return View
     */
    public function database()
    {
        $databaseManager = new DatabaseManager;
        $response = $databaseManager->migrateAndSeed();

        return redirect()->route('LaravelUpdater::final')
            ->with(['message' => $response]);
    }

    /**
     * Update installed file and display finished view.
     *
     * @return View
     */
    public function finish(InstalledFileManager $fileManager)
    {
        $fileManager->update();

        return view('installer::update.finished');
    }
}
