<?php

/**
 * JUZAWEB CMS - The Best CMS for Laravel Project
 *
 * @author     The Anh Dang <dangtheanh16@gmail.com>
 *
 * @link       https://github.com/juzaweb/cms
 *
 * @license    MIT
 *
 * Created by JUZAWEB.
 * Date: 6/19/2021
 * Time: 11:22 AM
 */

namespace Juzaweb\Modules\Installer\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Juzaweb\Modules\Core\Models\User;
use Juzaweb\Modules\Installer\Helpers\DatabaseManager;
use Juzaweb\Modules\Installer\Helpers\FinalInstallManager;
use Juzaweb\Modules\Installer\Helpers\InstalledFileManager;

class InstallCommand extends Command
{
    protected $signature = 'juzaweb:install
        {--name=}
        {--email=}
        {--password=}';

    protected array $user = [];

    public function handle(
        DatabaseManager $databaseManager,
        InstalledFileManager $fileManager,
        FinalInstallManager $finalInstall
    ) {
        $this->info('CMS Installtion');
        $this->info('-- Database Install');
        $databaseManager->run();
        $this->info('-- Publish assets');
        $finalInstall->runFinal();
        $this->info('-- Create user admin');

        $this->user['name'] = $this->option('name');
        $this->user['email'] = $this->option('email');
        $this->user['password'] = $this->option('password');

        $this->createAdminUser();
        $this->info('-- Update installed');
        $fileManager->update();
        $this->info('CMS Install Successfully !!!');
    }

    protected function createAdminUser(): void
    {
        if (empty($this->user['name'])) {
            $this->user['name'] = $this->ask('Full Name?');
        }

        if (empty($this->user['email'])) {
            $this->user['email'] = $this->ask('Email?');
        }

        if (empty($this->user['password'])) {
            $this->user['password'] = $this->ask('Password?');
        }

        $validator = Validator::make($this->user, [
            'name' => 'required|max:150',
            'email' => 'required|email|max:150',
            'password' => 'required|max:32|min:6',
        ], [], [
            'name' => trans('installer::message.environment.wizard.form.name'),
            'email' => trans('installer::message.environment.wizard.form.email'),
            'password' => trans('installer::message.environment.wizard.form.password'),
        ]);

        if ($validator->fails()) {
            $this->error($validator->errors()->first());

            $errors = $validator->errors();
            if ($errors->has('name')) {
                unset($this->user['name']);
            }

            if ($errors->has('email')) {
                unset($this->user['email']);
            }

            if ($errors->has('password')) {
                unset($this->user['password']);
            }

            $this->createAdminUser();

            return;
        }

        DB::transaction(
            function () {
                $model = new User;
                $model->fill($this->user);
                $model->password = Hash::make($this->user['password']);
                $model->is_super_admin = 1;
                $model->save();

                $model->markEmailAsVerified();
            }
        );
    }
}
