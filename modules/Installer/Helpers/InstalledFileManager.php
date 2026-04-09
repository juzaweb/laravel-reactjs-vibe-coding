<?php

namespace Juzaweb\Modules\Installer\Helpers;

use Illuminate\Support\Facades\Artisan;

class InstalledFileManager
{
    /**
     * Create installed file.
     *
     * @return int
     */
    public function create(): int|string
    {
        Artisan::call('vendor:publish', [
            '--tag' => 'core-assets',
            '--force' => true,
        ]);

        $installedLogFile = Intaller::installedPath();
        $dateStamp = date('Y/m/d h:i:sa');

        if (! file_exists($installedLogFile)) {
            $message = trans('installer::message.installed.success_log_message').$dateStamp."\n";

            file_put_contents($installedLogFile, $message);
        } else {
            $message = trans('installer::message.updater.log.success_message').$dateStamp;

            file_put_contents($installedLogFile, $message.PHP_EOL, FILE_APPEND | LOCK_EX);
        }

        return $message;
    }

    /**
     * Update installed file.
     *
     * @return int
     */
    public function update(): int|string
    {
        return $this->create();
    }
}
