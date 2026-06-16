<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        return Cart::all();
    }

    public function store(Request $request)
    {
        return Cart::create($request->all());
    }

    public function show(Cart $cart)
    {
        return $cart;
    }

    public function update(Request $request, Cart $cart)
    {
        $cart->update($request->all());
        return $cart;
    }

    public function destroy(Cart $cart)
    {
        $cart->delete();
        return response()->noContent();
    }
}
