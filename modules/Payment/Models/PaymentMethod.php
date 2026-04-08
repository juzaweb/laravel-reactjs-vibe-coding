<?php

namespace Juzaweb\Modules\Payment\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Juzaweb\Modules\Core\Models\Model;
use Juzaweb\Modules\Core\Traits\HasAPI;
use Juzaweb\Modules\Core\Traits\Translatable;
use Juzaweb\Modules\Payment\Contracts\PaymentGatewayInterface;
use Juzaweb\Modules\Payment\Database\factories\PaymentMethodFactory;
use Juzaweb\Modules\Payment\Facades\PaymentManager;
use Juzaweb\Modules\Payment\Http\Resources\PaymentMethodResource;
use Juzaweb\Modules\Core\Traits\HasResource;

class PaymentMethod extends Model
{
    use HasAPI, HasFactory, HasUuids, Translatable, HasResource;

    protected $table = 'payment_methods';

    protected $fillable = [
        'driver',
        'config',
        'active',
    ];

    protected $casts = [
        'config' => 'array',
        'active' => 'boolean',
    ];

    protected $appends = [
        'sandbox',
    ];

    public $translatedAttributes = [
        'name',
        'description',
        'locale',
    ];

    protected $hidden = [
        'config',
    ];

    public function scopeWhereActive(Builder $builder, bool $active = true): Builder
    {
        return $builder->where('active', $active);
    }

    public function getSandboxAttribute(): bool
    {
        return (bool) $this->getConfig('sandbox', false);
    }

    public function paymentDriver(): PaymentGatewayInterface
    {
        return PaymentManager::driver(
            $this->driver,
            $this->getConfig()
        );
    }

    public function getConfig(?string $key = null, $default = null): null|array|string
    {
        if (is_null($key)) {
            return $this->config;
        }

        return data_get($this->config, $key, $default);
    }

    protected static function newFactory()
    {
        return PaymentMethodFactory::new();
    }

    public static function getResource(): string
    {
        return PaymentMethodResource::class;
    }
}
