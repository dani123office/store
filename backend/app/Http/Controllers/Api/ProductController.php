<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with(['categoryRelation', 'subcategory', 'collections'])->get();
    }

    public function store(Request $request)
    {
        $product = Product::create($request->except('collection_ids'));
        if ($request->has('collection_ids')) {
            $product->collections()->sync($request->input('collection_ids'));
        }
        return $product->load(['categoryRelation', 'subcategory', 'collections']);
    }

    public function show(Product $product)
    {
        return $product->load(['categoryRelation', 'subcategory', 'collections']);
    }

    public function update(Request $request, Product $product)
    {
        $product->update($request->except('collection_ids'));
        if ($request->has('collection_ids')) {
            $product->collections()->sync($request->input('collection_ids'));
        } else {
            $product->collections()->sync([]);
        }
        return $product->load(['categoryRelation', 'subcategory', 'collections']);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
}
