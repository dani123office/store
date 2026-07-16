<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        $user = request()->user();
        $query = Order::with('user');
        
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        } elseif (request()->has('user_id')) {
            $query->where('user_id', request()->get('user_id'));
        }
        
        $orders = $query->get();
        return $orders->map(function ($order) {
            return $this->format($order);
        });
    }

    /**
     * Create a new order with server-side validation, idempotency, and transactional safety.
     */
    public function store(Request $request)
    {
        $idempotencyKey = $request->header('X-Idempotency-Key') ?? $request->input('idempotency_key');
        
        // 1. Idempotency Check
        if ($idempotencyKey) {
            $cachedResponse = Cache::get("idempotency:{$idempotencyKey}");
            if ($cachedResponse) {
                return response()->json($cachedResponse, 200);
            }
        }

        $request->validate([
            'products' => 'required',
            'data' => 'required', // Shipping details, payment details, etc.
            'coupon_code' => 'nullable|string|exists:coupons,code',
        ]);

        $productsRaw = $request->input('products');
        $products = is_string($productsRaw) ? json_decode($productsRaw, true) : $productsRaw;
        
        if (!is_array($products) || empty($products)) {
            return response()->json(['error' => 'Cart products are empty or invalid.'], 422);
        }

        $input = $request->all();
        $calculatedSubtotal = 0.00;
        $validatedProducts = [];

        try {
            // Start DB Transaction to guarantee atomic operations across all items
            $order = DB::transaction(function () use ($request, $input, $products, &$calculatedSubtotal, &$validatedProducts) {
                
                foreach ($products as $cartItem) {
                    $qty = intval($cartItem['quantity'] ?? 1);
                    if ($qty <= 0) {
                        throw new \Exception("Invalid quantity for product.");
                    }

                    // Identify variant or standard product
                    $variantId = $cartItem['variant_id'] ?? null;
                    $productId = $cartItem['product_id'] ?? null;

                    // Fallback to extract ID from legacy string '2xsblack'
                    if (!$productId && isset($cartItem['id'])) {
                        preg_match('/^\d+/', $cartItem['id'], $matches);
                        $productId = $matches[0] ?? null;
                    }

                    if (!$productId) {
                        throw new \Exception("Product ID could not be identified.");
                    }

                    $product = Product::find($productId);
                    if (!$product) {
                        throw new \Exception("Product not found.");
                    }

                    $unitPrice = 0.00;

                    // If checking out a variant, validate variant stock and variant price
                    if ($variantId) {
                        $variant = ProductVariant::find($variantId);
                        if (!$variant || $variant->product_id !== $product->id) {
                            throw new \Exception("Product variant not found.");
                        }

                        // Validate variant stock
                        if ($variant->stock < $qty) {
                            throw new \Exception("Insufficient stock for product variant: {$product->title} ({$variant->size} - {$variant->color}).");
                        }

                        // Decrement variant stock atomically
                        if (!$variant->decrementStock($qty)) {
                            throw new \Exception("Stock allocation failed for variant: {$product->title}.");
                        }

                        $unitPrice = floatval($variant->price);
                        $cartItem['size'] = $variant->size;
                        $cartItem['color'] = $variant->color;
                    } else {
                        // Standard product without variant
                        if ($product->stock < $qty) {
                            throw new \Exception("Insufficient stock for product: {$product->title}.");
                        }

                        // Decrement stock atomically
                        $affected = DB::update(
                            "UPDATE products SET stock = stock - ?, updated_at = ? WHERE id = ? AND stock >= ?",
                            [$qty, now(), $product->id, $qty]
                        );

                        if (!$affected) {
                            throw new \Exception("Stock allocation failed for: {$product->title}.");
                        }

                        $unitPrice = floatval($product->price);
                    }

                    // Accumulate verified pricing
                    $calculatedSubtotal += ($unitPrice * $qty);

                    // Rebuild secure cart item payload (not trusting user-supplied prices)
                    $cartItem['price'] = $unitPrice;
                    $cartItem['total'] = $unitPrice * $qty;
                    $validatedProducts[] = $cartItem;
                }

                // Apply coupon discount if provided
                $discount = 0.00;
                if ($request->filled('coupon_code')) {
                    $coupon = Coupon::where('code', $request->input('coupon_code'))->first();
                    if ($coupon && $coupon->isValidFor($calculatedSubtotal)) {
                        $discount = $coupon->calculateDiscount($calculatedSubtotal);
                    } else {
                        throw new \Exception("Coupon code is invalid or does not meet requirements.");
                    }
                }

                $finalSubtotal = max(0.00, $calculatedSubtotal - $discount);

                // Build order
                $orderData = [
                    'user_id' => $request->user() ? $request->user()->id : ($request->input('user.id') ?? null),
                    'data' => is_array($request->input('data')) ? json_encode($request->input('data')) : $request->input('data'),
                    'products' => json_encode($validatedProducts),
                    'subtotal' => $finalSubtotal,
                    'orderStatus' => 'Processing',
                    'orderDate' => now()->toIso8601String(),
                ];

                return Order::create($orderData);
            });

            if ($order->user_id) {
                $order->load('user');
            }

            // Dispatch background task for invoice generation & email sending
            dispatch(new \App\Jobs\SendOrderInvoiceMail($order));

            $formattedOrder = $this->format($order);

            // Cache response if idempotency key is supplied
            if ($idempotencyKey) {
                Cache::put("idempotency:{$idempotencyKey}", $formattedOrder, 300); // 5 mins cache
            }

            return response()->json($formattedOrder, 201);

        } catch (\Exception $e) {
            Log::error("Checkout transaction failed: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function show(Order $order)
    {
        $currUser = request()->user();
        if ($currUser->role !== 'admin' && $order->user_id !== $currUser->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $order->load('user');
        return $this->format($order);
    }

    public function update(Request $request, Order $order)
    {
        $currUser = $request->user();
        if (!$currUser) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // 1. Handle orderStatus change via state machine transition
        if ($request->has('orderStatus')) {
            if ($currUser->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized to modify order status.'], 403);
            }
            
            try {
                $order->transitionTo(
                    $request->input('orderStatus'),
                    $currUser->id,
                    $request->input('status_comment')
                );
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 422);
            }
        }

        // 2. Handle other general fields update
        $input = $request->except('orderStatus');
        if (!empty($input)) {
            if ($currUser->role !== 'admin' && $order->user_id !== $currUser->id) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
            if (isset($input['data']) && is_array($input['data'])) {
                $input['data'] = json_encode($input['data']);
            }
            if (isset($input['products']) && is_array($input['products'])) {
                $input['products'] = json_encode($input['products']);
            }
            if (isset($input['user']) && is_array($input['user'])) {
                $input['user_id'] = $input['user']['id'] ?? null;
            }
            unset($input['user']);
            $order->update($input);
        }

        $order->load('user');
        return $this->format($order);
    }

    public function destroy(Order $order)
    {
        $currUser = request()->user();
        if ($currUser->role !== 'admin' && $order->user_id !== $currUser->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $order->delete();
        return response()->noContent();
    }

    private function format($order)
    {
        $arr = $order->toArray();
        $arr['data'] = is_string($arr['data']) ? json_decode($arr['data'], true) : ($arr['data'] ?? []);
        $arr['products'] = is_string($arr['products']) ? json_decode($arr['products'], true) : ($arr['products'] ?? []);
        $arr['user'] = $order->relationLoaded('user') && $order->user
            ? ['email' => $order->user->email, 'id' => $order->user->id]
            : null;
        unset($arr['user_id']);
        return $arr;
    }
}
