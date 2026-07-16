<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the user's cart items (Scoped to authenticated user).
     */
    public function index()
    {
        $user = request()->user();
        $cartItems = Cart::where('user_id', $user->id)->get();

        return $this->successResponse($cartItems, 'Cart items fetched successfully.');
    }

    /**
     * Add a product to the authenticated user's cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'pro_id' => 'required|exists:products,id',
            'product_size' => 'nullable|string|max:50',
            'product_color' => 'nullable|string|max:50',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $product = Product::find($request->pro_id);

        // Fetch price. If size/color matches a variant, resolve variant price
        $price = floatval($product->price);
        if ($request->filled('product_size') || $request->filled('product_color')) {
            $variant = $product->variants()
                ->where('size', $request->product_size)
                ->where('color', $request->product_color)
                ->first();

            if ($variant) {
                $price = floatval($variant->price);
            }
        }

        $quantity = intval($request->quantity);
        $total = $price * $quantity;

        // Check if item already exists in user's cart, increment quantity if it does
        $existingCartItem = Cart::where('user_id', $user->id)
            ->where('pro_id', $product->id)
            ->where('product_size', $request->product_size)
            ->where('product_color', $request->product_color)
            ->first();

        if ($existingCartItem) {
            $newQuantity = $existingCartItem->quantity + $quantity;
            $existingCartItem->update([
                'quantity' => $newQuantity,
                'total' => $price * $newQuantity
            ]);

            return $this->successResponse($existingCartItem, 'Cart item quantity updated.');
        }

        $cart = Cart::create([
            'pro_id' => $product->id,
            'user_id' => $user->id,
            'product_title' => $product->title,
            'product_image' => $product->image ?? null,
            'product_size' => $request->product_size,
            'product_color' => $request->product_color,
            'product_price' => $price,
            'quantity' => $quantity,
            'total' => $total,
        ]);

        return $this->successResponse($cart, 'Product added to cart successfully.', 201);
    }

    /**
     * Display a specific cart item (Scoped by ownership).
     */
    public function show(Cart $cart)
    {
        $user = request()->user();

        if ($cart->user_id !== $user->id) {
            return $this->errorResponse('Forbidden. You do not own this cart item.', 403);
        }

        return $this->successResponse($cart, 'Cart item details fetched successfully.');
    }

    /**
     * Update a specific cart item's quantity (Scoped by ownership).
     */
    public function update(Request $request, Cart $cart)
    {
        $user = request()->user();

        if ($cart->user_id !== $user->id) {
            return $this->errorResponse('Forbidden. You do not own this cart item.', 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $quantity = intval($request->quantity);
        $total = floatval($cart->product_price) * $quantity;

        $cart->update([
            'quantity' => $quantity,
            'total' => $total
        ]);

        return $this->successResponse($cart, 'Cart item updated successfully.');
    }

    /**
     * Remove a specific item from the cart (Scoped by ownership).
     */
    public function destroy(Cart $cart)
    {
        $user = request()->user();

        if ($cart->user_id !== $user->id) {
            return $this->errorResponse('Forbidden. You do not own this cart item.', 403);
        }

        $cart->delete();

        return $this->successResponse(null, 'Item removed from cart successfully.');
    }
}
