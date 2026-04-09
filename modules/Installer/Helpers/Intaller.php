<?php

/**
 * JUZAWEB CMS - The Best CMS for Laravel Project
 *
 * @package    juzaweb/cms
 * @author     The Anh Dang <dangtheanh16@gmail.com>
 * @link       https://github.com/juzaweb/cms
 * @license    MIT
 *
 * Created by JUZAWEB.
 * Date: 6/12/2021
 * Time: 6:20 PM
 */

namespace Juzaweb\Modules\Installer\Helpers;


class Intaller
{
    /**
     * If application is already installed.
     *
     * @return bool
     */
    public static function alreadyInstalled()
    {
        return file_exists(static::installedPath());
    }

    public static function installedPath()
    {
        return storage_path('app/installed');
    }
}
