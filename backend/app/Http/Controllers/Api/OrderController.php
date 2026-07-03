<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

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

    public function store(Request $request)
    {
        $input = $request->all();
        $productsRaw = $request->input('products', []);
        
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
        
        $order = Order::create($input);
        
        // Decr product stock based on cart items
        $products = is_string($productsRaw) ? json_decode($productsRaw, true) : $productsRaw;
        if (is_array($products)) {
            foreach ($products as $p) {
                if (isset($p['id'])) {
                    preg_match('/^\d+/', $p['id'], $matches);
                    $realProductId = $matches[0] ?? null;
                    if ($realProductId) {
                        $qty = intval($p['quantity'] ?? 1);
                        \Illuminate\Support\Facades\DB::table('products')
                            ->where('id', $realProductId)
                            ->decrement('stock', $qty);
                    }
                }
            }
        }

        if ($input['user_id'] ?? null) {
            $order->load('user');
        }
        return response()->json($this->format($order), 201);
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
        $currUser = request()->user();
        if ($currUser->role !== 'admin' && $order->user_id !== $currUser->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $input = $request->all();
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
