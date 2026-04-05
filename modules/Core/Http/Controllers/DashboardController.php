<?php

/**
 * LARABIZ CMS - Full SPA Laravel CMS
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 */

namespace Juzaweb\Modules\Core\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Juzaweb\Modules\Core\Models\Media;
use Juzaweb\Modules\Core\Models\Pages\Page;
use Juzaweb\Modules\Core\Models\User;

class DashboardController extends AdminController
{
    public function index()
    {
        $totalUsers = $this->getTotalUsers();
        $totalPages = Page::count();
        $usedStorage = Media::cacheFor(3600)->sum('size');
        $storageFree = disk_free_space(storage_path());

        return view(
            'core::dashboard.index',
            [
                'title' => __('core::translation.dashboard'),
                ...compact('totalUsers', 'storageFree', 'usedStorage', 'totalPages'),
            ]
        );
    }

    public function online(): JsonResponse
    {
        return response()->json([
            'total' => number_human_format(online_count()),
        ]);
    }

    protected function getTotalUsers(): int
    {
        return User::query()
            ->cacheFor(1800)
            ->count();
    }
}
