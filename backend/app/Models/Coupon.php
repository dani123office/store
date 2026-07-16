<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $guarded = [];

    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Check if the coupon is currently valid based on date limits and order subtotal.
     *
     * @param float $subtotal
     * @return bool
     */
    public function isValidFor(float $subtotal): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();

        if ($this->starts_at && $now->lt($this->starts_at)) {
            return false;
        }

        if ($this->expires_at && $now->gt($this->expires_at)) {
            return false;
        }

        if ($subtotal < $this->min_order_value) {
            return false;
        }

        return true;
    }

    /**
     * Calculate discount amount for a given subtotal.
     *
     * @param float $subtotal
     * @return float
     */
    public function calculateDiscount(float $subtotal): float
    {
        if (!$this->isValidFor($subtotal)) {
            return 0.00;
        }

        if ($this->type === 'percentage') {
            $discount = ($subtotal * $this->value) / 100;
            return min($discount, $subtotal); // Coupon cannot exceed subtotal
        }

        // Fixed type
        return min($this->value, $subtotal);
    }
}
