<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use SoftDeletes;

    const STATUS_PENDING = 'Pending';
    const STATUS_AWAITING_VERIFICATION = 'Awaiting Verification';
    const STATUS_PROCESSING = 'Processing';
    const STATUS_SHIPPED = 'Shipped';
    const STATUS_DELIVERED = 'Delivered';
    const STATUS_CANCELLED = 'Cancelled';
    const STATUS_REFUNDED = 'Refunded';

    protected $guarded = [];

    protected $casts = [
        'data' => 'array',
        'products' => 'array',
    ];

    /**
     * Map of valid state transitions.
     * Prevents illegal transitions (e.g. Delivered -> Processing).
     *
     * @return array
     */
    public static function getValidTransitions(): array
    {
        return [
            self::STATUS_PENDING => [self::STATUS_PROCESSING, self::STATUS_CANCELLED],
            self::STATUS_AWAITING_VERIFICATION => [self::STATUS_PROCESSING, self::STATUS_CANCELLED],
            self::STATUS_PROCESSING => [self::STATUS_SHIPPED, self::STATUS_CANCELLED],
            self::STATUS_SHIPPED => [self::STATUS_DELIVERED, self::STATUS_CANCELLED],
            self::STATUS_DELIVERED => [self::STATUS_REFUNDED],
            self::STATUS_CANCELLED => [],
            self::STATUS_REFUNDED => [],
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(OrderStatusLog::class)->orderBy('created_at', 'desc');
    }

    /**
     * Transition the order to a new state securely.
     * Handles state validation, logs history, restores stock if cancelled, and fires events.
     *
     * @param string $newStatus
     * @param int|null $userId
     * @param string|null $comment
     * @return bool
     * @throws \Exception
     */
    public function transitionTo(string $newStatus, ?int $userId = null, ?string $comment = null): bool
    {
        $oldStatus = $this->orderStatus;

        if ($oldStatus === $newStatus) {
            return true;
        }

        $allowed = self::getValidTransitions()[$oldStatus] ?? [];
        if (!in_array($newStatus, $allowed)) {
            throw new \Exception("Invalid order transition from '{$oldStatus}' to '{$newStatus}'.");
        }

        DB::transaction(function () use ($newStatus, $oldStatus, $userId, $comment) {
            // Update order
            $this->update(['orderStatus' => $newStatus]);

            // Write audit log
            OrderStatusLog::create([
                'order_id' => $this->id,
                'from_status' => $oldStatus,
                'to_status' => $newStatus,
                'changed_by' => $userId,
                'comment' => $comment,
            ]);

            // Restore stock dynamically if status transitions to Cancelled
            if ($newStatus === self::STATUS_CANCELLED) {
                $this->restoreStock();
            }

            // Dispatch event
            event(new \App\Events\OrderStatusChanged($this, $oldStatus, $newStatus));
        });

        return true;
    }

    /**
     * Restore stock of all items in this order back to inventory.
     */
    public function restoreStock()
    {
        $products = is_string($this->products) ? json_decode($this->products, true) : $this->products;
        if (!is_array($products)) {
            return;
        }

        foreach ($products as $p) {
            $qty = intval($p['quantity'] ?? 1);
            $variantId = $p['variant_id'] ?? null;
            $productId = $p['product_id'] ?? null;

            // Fallback for legacy ID
            if (!$productId && isset($p['id'])) {
                preg_match('/^\d+/', $p['id'], $matches);
                $productId = $matches[0] ?? null;
            }

            if ($variantId) {
                $variant = ProductVariant::find($variantId);
                if ($variant) {
                    $variant->increment('stock', $qty);
                }
            } elseif ($productId) {
                $product = Product::find($productId);
                if ($product) {
                    $product->increment('stock', $qty);
                }
            }
        }
    }

    public function toArray()
    {
        $array = parent::toArray();
        $array['user'] = $this->user ? [
            'email' => $this->user->email,
            'id' => $this->user->id,
        ] : ($array['user'] ?? null);
        $array['products'] = is_string($array['products'] ?? null) ? json_decode($array['products'], true) : ($array['products'] ?? []);
        $array['data'] = is_string($array['data'] ?? null) ? json_decode($array['data'], true) : ($array['data'] ?? []);
        return $array;
    }
}
