<?php

namespace Juzaweb\Modules\AdsManagement\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Juzaweb\Modules\AdsManagement\Database\Factories\VideoAdsFactory;
use Juzaweb\Modules\AdsManagement\Http\Resources\VideoAdsResource;
use Juzaweb\Modules\Core\Models\Model;
use Juzaweb\Modules\Core\Traits\HasResource;

class VideoAds extends Model
{
    use HasUuids, HasFactory, HasResource;

    protected $table = 'video_ads';

    protected $fillable = [
        'name',
        'title',
        'url',
        'video',
        'position',
        'offset',
        'options',
        'active',
        'views',
        'click',
    ];

    public $casts = [
        'options' => 'array',
        'active' => 'boolean',
        'views' => 'integer',
        'click' => 'integer',
        'offset' => 'integer',
    ];

    protected static function newFactory(): VideoAdsFactory
    {
        return VideoAdsFactory::new();
    }

    public function bulkActions(): array
    {
        return ['delete', 'activate', 'deactivate'];
    }

    public static function getFieldName(): string
    {
        return 'name';
    }

    public static function getResource(): string
    {
        return VideoAdsResource::class;
    }
}
