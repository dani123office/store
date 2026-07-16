<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class ProductVariant extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    /**
     * Relationship with parent Product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the active price of the variant.
     * Falls back to the parent product's price if the variant price is not set.
     */
    public function getPriceAttribute($value)
    {
        return $value ?? $this->product->price;
    }

    /**
     * Scope for filtering low stock variants
     */
    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock', '<=', 'reorder_threshold');
    }

    /**
     * Atomically decrement the stock.
     * Prevents stock from going below zero using a database-level constraint.
     * Returns true on success, false if there is insufficient stock.
     *
     * @param int $quantity
     * @return bool
     */
    public function decrementStock(int $quantity): bool
    {
        if ($quantity <= 0) {
            return true;
        }

        // Run atomic update
        $affected = DB::update(
            "UPDATE product_variants 
             SET stock = stock - ?, updated_at = ? 
             WHERE id = ? AND stock >= ? AND deleted_at IS NULL",
            [$quantity, now(), $this->id, $quantity]
        );

        if ($affected > 0) {
            // Refresh model attributes in memory
            $this->refresh();
            return true;
        }

        return false;
    }
}
