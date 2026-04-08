<?php
/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @package    juzaweb/cms
 * @author     The Anh Dang
 * @link       https://cms.juzaweb.com
 * @license    GNU V2
 */

namespace Juzaweb\Modules\Core\Http\Controllers;

class HomeController extends Controller
{
    public function index()
    {
        return view('core::home');
    }

    public function admin()
    {
        return view('core::dashboard');
    }
}
