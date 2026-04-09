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

namespace Juzaweb\Modules\AdsManagement\Facades;

use Illuminate\Support\Facades\Facade;
use Juzaweb\Modules\AdsManagement\AdsRepository;

/**
 * @method static void position(string $key, callable $callback)
 * @method static \Illuminate\Support\Collection positions()
 * @method static \Illuminate\Support\Collection bannerPositions()
 * @method static \Illuminate\Support\Collection videoPositions()
 * @method static \Juzaweb\Modules\AdsManagement\Models\BannerAds|null getBanner(string $position)
 * @method static void enableVideoAds(bool $enabled = true)
 * @method static bool isVideoAdsEnabled()
 *
 * @see AdsRepository
 */
class Ads extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \Juzaweb\Modules\AdsManagement\Ads::class;
    }
}
