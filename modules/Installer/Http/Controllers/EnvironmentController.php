<?php

namespace Juzaweb\Modules\Installer\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\DB;
use Juzaweb\Modules\Installer\Events\EnvironmentSaved;
use Juzaweb\Modules\Installer\Helpers\EnvironmentManager;
use Illuminate\Support\Facades\Validator;

class EnvironmentController extends Controller
{
    protected $environmentManager;

    public function __construct(EnvironmentManager $environmentManager)
    {
        $this->environmentManager = $environmentManager;
    }

    public function environment()
    {
        $envConfig = $this->environmentManager->getEnvContent();

        return view('installer::environment', compact('envConfig'));
    }

    public function save(Request $request, Redirector $redirect)
    {
        $rules = [
            'database_hostname'     => 'required|string|max:150',
            'database_port'         => 'required|numeric',
            'database_name'         => 'required|string|max:150',
            'database_username'     => 'required|string|max:150',
            'database_password'     => 'nullable|string|max:150',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $redirect->route('installer.environment')
                ->withInput()
                ->withErrors($validator->errors());
        }

        if (! $this->checkDatabaseConnection($request)) {
            return $redirect->route('installer.environment')
                ->withInput()
                ->withErrors([
                    'database_connection' => trans('installer::message.environment.wizard.form.db_connection_failed'),
                ]);
        }

        $results = $this->environmentManager->saveFileWizard($request);

        event(new EnvironmentSaved($request));

        return $redirect->route('installer.database')
            ->with(['results' => $results]);
    }

    private function checkDatabaseConnection(Request $request)
    {
        $connection = 'mysql';

        $settings = config("database.connections.{$connection}");

        if (!is_array($settings)) {
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
}
