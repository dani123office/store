<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductImage;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    public function index()
    {
        return ProductImage::all();
    }

    public function store(Request $request)
    {
        return ProductImage::create($request->all());
    }

    public function show(ProductImage $productImage)
    {
        return $productImage;
    }

    public function update(Request $request, ProductImage $productImage)
    {
        $productImage->update($request->all());
        return $productImage;
    }

    public function destroy(ProductImage $productImage)
    {
        $productImage->delete();
        return response()->noContent();
    }
}
