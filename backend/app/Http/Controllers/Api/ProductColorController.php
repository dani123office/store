<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductColor;
use Illuminate\Http\Request;

class ProductColorController extends Controller
{
    public function index()
    {
        return ProductColor::all();
    }

    public function store(Request $request)
    {
        return ProductColor::create($request->all());
    }

    public function show(ProductColor $productColor)
    {
        return $productColor;
    }

    public function update(Request $request, ProductColor $productColor)
    {
        $productColor->update($request->all());
        return $productColor;
    }

    public function destroy(ProductColor $productColor)
    {
        $productColor->delete();
        return response()->noContent();
    }
}
