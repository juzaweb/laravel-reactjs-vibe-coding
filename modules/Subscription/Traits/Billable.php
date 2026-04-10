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

namespace Juzaweb\Modules\Subscription\Traits;

use Illuminate\Database\Eloquent\Relations\MorphMany;
use Juzaweb\Modules\Subscription\Models\FeatureUsageLog;
use Juzaweb\Modules\Subscription\Models\Plan;
use Juzaweb\Modules\Subscription\Models\Subscription;

trait Billable
{
    public function subscribed(): bool
    {
        $subscription = $this->subscription();

        return $subscription && $subscription->isValid();
    }

    public function currentPlan(): ?Plan
    {
        $subscription = $this->subscription();

        if ($subscription === null || ! $subscription->isValid()) {
            return $this->getDefaultPlan();
        }

        return $subscription->plan;
    }

    public function getDefaultPlan(): ?Plan
    {
        return Plan::where(['is_free' => true])
            ->whereActive(true)
            ->first();
    }

    public function canUseFeature(string $featureKey): bool
    {
        $value = $this->getFeatureValue($featureKey);

        return isset($value) && $value > 0;
    }

    public function getFeatureValue(string $featureKey)
    {
        $plan = $this->currentPlan();
        if ($plan === null) {
            return null;
        }

        $feature = $plan->features()->where('name', $featureKey)->first();

        return $feature->value ?? null;
    }

    public function subscription(): ?Subscription
    {
        $tlt = (int) now()->diffInSeconds(now()->endOfDay());

        return $this->subscriptions()

            ->cacheFor($tlt)
            ->latest()
            ->first();
    }

    public function featureUsageLogModel()
    {
        return FeatureUsageLog::class;
    }

    /**
     * Check if you can use feature within limit and track usage
     *

     * @param  string  $featureKey  Feature key name
     * @param  int  $increment  Number to increment usage by
     */
    public function checkFeatureLimit(string $featureKey, int $increment = 1): bool
    {
        $limit = $this->getFeatureValue($featureKey);

        // If no limit set, allow unlimited usage
        if ($limit === null || $limit <= 0) {
            return true;
        }

        $currentUsage = $this->featureUsageLogModel()::getUsageCount($featureKey);

        // Check if adding increment would exceed limit
        return ($currentUsage + $increment) <= $limit;
    }

    public function incrementUsage(string $featureKey, int $increment = 1)
    {
        // Increment usage count
        $this->featureUsageLogModel()::incrementUsage(
            $featureKey,
            $increment
        );
    }

    public function subscriptions(): MorphMany
    {
        return $this->morphMany(
            Subscription::class,
            'billable'
        );
    }
}
