<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductSize;
use Illuminate\Http\Request;

class ProductSizeController extends Controller
{
    public function index()
    {
        return ProductSize::all();
    }

    public function store(Request $request)
    {
        return ProductSize::create($request->all());
    }

    public function show(ProductSize $productSize)
    {
        return $productSize;
    }

    public function update(Request $request, ProductSize $productSize)
    {
        $productSize->update($request->all());
        return $productSize;
    }

    public function destroy(ProductSize $productSize)
    {
        $productSize->delete();
        return response()->noContent();
    }
}
