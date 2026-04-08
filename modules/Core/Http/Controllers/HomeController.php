<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 *
 * @license    GNU V2
 */

namespace Juzaweb\Modules\Core\Http\Controllers;

class HomeController extends Controller
{
    public function index()
    {
        $themePath = base_path('themes/app/dist/index.html');

        if (! file_exists($themePath)) {
            abort(404);
        }

        $content = file_get_contents($themePath);

        return response($content);
    }

    public function admin()
    {
        $content = file_get_contents(base_path('themes/admin/dist/index.html'));

        return response($content);
    }
}
