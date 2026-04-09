<?php

namespace Juzaweb\Modules\Installer\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Core\Traits\HasRestResponses;
use Juzaweb\Modules\Installer\Events\EnvironmentSaved;
use Juzaweb\Modules\Installer\Events\InstallerFinished;
use Juzaweb\Modules\Installer\Helpers\DatabaseManager;
use Juzaweb\Modules\Installer\Helpers\EnvironmentManager;
use Juzaweb\Modules\Installer\Helpers\FinalInstallManager;
use Juzaweb\Modules\Installer\Helpers\InstalledFileManager;
use Juzaweb\Modules\Installer\Helpers\PermissionsChecker;
use Juzaweb\Modules\Installer\Helpers\RequirementsChecker;
use Juzaweb\Modules\Installer\Http\Requests\AdminSetupRequest;
use Juzaweb\Modules\Installer\Http\Requests\SaveEnvironmentRequest;

class InstallerController extends Controller
{
    use HasRestResponses;

    protected $environmentManager;

    protected $requirements;

    protected $permissions;

    protected $databaseManager;

    public function __construct(
        EnvironmentManager $environmentManager,
        RequirementsChecker $requirements,
        PermissionsChecker $permissions,
        DatabaseManager $databaseManager
    ) {
        $this->environmentManager = $environmentManager;
        $this->requirements = $requirements;
        $this->permissions = $permissions;
        $this->databaseManager = $databaseManager;
    }

    public function requirements()
    {
        $phpSupportInfo = $this->requirements->checkPHPversion(
            config('installer.core.minPhpVersion')
        );
        $requirements = $this->requirements->check(
            config('installer.requirements')
        );

        return $this->restSuccess([
            'phpSupportInfo' => $phpSupportInfo,
            'requirements' => $requirements,
        ]);
    }

    public function permissions()
    {
        $permissions = $this->permissions->check(
            config('installer.permissions')
        );

        return $this->restSuccess([
            'permissions' => $permissions,
        ]);
    }

    public function environment()
    {
        $envConfig = $this->environmentManager->getEnvContent();

        return $this->restSuccess(['envConfig' => $envConfig]);
    }

    public function saveEnvironment(SaveEnvironmentRequest $request)
    {
        if (! $this->checkDatabaseConnection($request)) {
            return $this->restFail(trans('installer::message.environment.wizard.form.db_connection_failed'));
        }

        $results = $this->environmentManager->saveFileWizard($request);

        event(new EnvironmentSaved($request));

        return $this->restSuccess(['results' => $results], trans('installer::message.environment.success'));
    }

    private function checkDatabaseConnection(Request $request)
    {
        $connection = 'mysql';

        $settings = config("database.connections.{$connection}");

        if (! is_array($settings)) {
            $settings = [];
        }

        config([
            "database.connections.{$connection}" => array_merge($settings, [
                'driver' => $connection,
                'host' => $request->input('database_hostname'),
                'port' => $request->input('database_port'),
                'database' => $request->input('database_name'),
                'username' => $request->input('database_username'),
                'password' => $request->input('database_password'),
            ]),
        ]);

        DB::purge($connection);

        try {
            DB::connection($connection)->getPdo();

            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function database()
    {
        try {
            $response = $this->databaseManager->run();

            return $this->restSuccess(['message' => $response]);
        } catch (Exception $e) {
            return $this->restFail($e->getMessage());
        }
    }

    public function admin(AdminSetupRequest $request)
    {
        try {
            DB::transaction(
                function () use ($request) {
                    $model = new User;
                    $model->fill($request->all());
                    $model->password = Hash::make($request->post('password'));
                    $model->is_super_admin = 1;
                    $model->save();
                }
            );

            return $this->restSuccess([], trans('installer::message.final.finished'));
        } catch (Exception $e) {
            return $this->restFail($e->getMessage());
        }
    }

    public function final(
        InstalledFileManager $fileManager,
        FinalInstallManager $finalInstall
    ) {
        try {
            $finalMessages = $finalInstall->runFinal();
            $finalStatusMessage = $fileManager->update();

            event(new InstallerFinished);

            return $this->restSuccess([
                'finalMessages' => $finalMessages,
                'finalStatusMessage' => $finalStatusMessage,
            ], trans('installer::message.final.finished'));
        } catch (\Throwable $e) {
            return $this->restFail($e->getMessage());
        }
    }
}
