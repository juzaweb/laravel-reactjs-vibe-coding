<?php

namespace Juzaweb\Modules\Installer\Helpers;

use Illuminate\Support\Facades\Artisan;
use Symfony\Component\Console\Output\BufferedOutput;
use Throwable;

class FinalInstallManager
{
    /**
     * Run final commands.
     *
     * @return string
     *
     * @throws Throwable
     */
    public function runFinal()
    {
        $outputLog = new BufferedOutput;

        $this->generateKey($outputLog);
        $this->publishVendorAssets($outputLog);

        return $outputLog->fetch();
    }

    /**
     * Generate New Application Key.
     *
     * @return BufferedOutput|array
     */
    private static function generateKey(BufferedOutput $outputLog)
    {
        try {
            if (config('installer.final.key') && ! config('app.key')) {
                Artisan::call('key:generate', ['--force' => true], $outputLog);
            }
        } catch (Throwable $e) {
            return static::response($e->getMessage(), $outputLog);
        }

        return $outputLog;
    }

    /**
     * Publish vendor assets.
     *
     * @return BufferedOutput|array
     *
     * @throws Throwable
     */
    private static function publishVendorAssets(BufferedOutput $outputLog)
    {
        try {
            Artisan::call('storage:link', [], $outputLog);
        } catch (Throwable $e) {
            throw $e;
        }

        return $outputLog;
    }

    /**
     * Return a formatted error messages.
     *
     * @return array
     */
    private static function response($message, BufferedOutput $outputLog)
    {
        return [
            'status' => 'error',
            'message' => $message,
            'dbOutputLog' => $outputLog->fetch(),
        ];
    }
}
