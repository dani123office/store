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
        $input = $request->except('collection_ids');
        if (isset($input['category_id'])) {
            $cat = \Illuminate\Support\Facades\DB::table('categories')->where('cat_id', $input['category_id'])->first();
            if ($cat) {
                $input['category'] = $cat->cat_title;
            }
        }
        $product = Product::create($input);
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
        $input = $request->except('collection_ids');
        if (isset($input['category_id'])) {
            $cat = \Illuminate\Support\Facades\DB::table('categories')->where('cat_id', $input['category_id'])->first();
            if ($cat) {
                $input['category'] = $cat->cat_title;
            }
        }
        $product->update($input);
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
