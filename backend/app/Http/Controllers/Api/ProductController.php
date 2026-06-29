<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with(['categoryRelation', 'subcategory', 'collections', 'colors', 'sizes', 'additionalImages'])->get();
    }

    public function store(Request $request)
    {
        $input = $request->except(['collection_ids', 'colors', 'sizes', 'additional_images']);
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

        // Save nested Colors relation
        if ($request->has('colors')) {
            $colorsArray = $request->input('colors', []);
            $colorsData = [
                'color1' => $colorsArray[0] ?? '',
                'color2' => $colorsArray[1] ?? '',
                'color3' => $colorsArray[2] ?? '',
                'color4' => $colorsArray[3] ?? '',
                'color5' => $colorsArray[4] ?? '',
                'color6' => $colorsArray[5] ?? '',
            ];
            $product->colors()->updateOrCreate(['pro_id' => $product->id], $colorsData);
        }

        // Save nested Sizes relation
        if ($request->has('sizes')) {
            $sizesArray = $request->input('sizes', []);
            $sizesData = [
                'size1' => $sizesArray[0] ?? '',
                'size2' => $sizesArray[1] ?? '',
                'size3' => $sizesArray[2] ?? '',
                'size4' => $sizesArray[3] ?? '',
                'size5' => $sizesArray[4] ?? '',
                'size6' => $sizesArray[5] ?? '',
            ];
            $product->sizes()->updateOrCreate(['pro_id' => $product->id], $sizesData);
        }

        // Save nested Gallery Images relation
        if ($request->has('additional_images')) {
            $imagesArray = $request->input('additional_images', []);
            $imagesData = [
                'pro_img2' => $imagesArray[0] ?? null,
                'pro_img3' => $imagesArray[1] ?? null,
                'pro_img4' => $imagesArray[2] ?? null,
                'pro_img5' => $imagesArray[3] ?? null,
            ];
            $product->additionalImages()->updateOrCreate(['pro_id' => $product->id], $imagesData);
        }

        return $product->load(['categoryRelation', 'subcategory', 'collections', 'colors', 'sizes', 'additionalImages']);
    }

    public function show(Product $product)
    {
        return $product->load(['categoryRelation', 'subcategory', 'collections', 'colors', 'sizes', 'additionalImages']);
    }

    public function update(Request $request, Product $product)
    {
        $input = $request->except(['collection_ids', 'colors', 'sizes', 'additional_images']);
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

        // Save nested Colors relation
        if ($request->has('colors')) {
            $colorsArray = $request->input('colors', []);
            $colorsData = [
                'color1' => $colorsArray[0] ?? '',
                'color2' => $colorsArray[1] ?? '',
                'color3' => $colorsArray[2] ?? '',
                'color4' => $colorsArray[3] ?? '',
                'color5' => $colorsArray[4] ?? '',
                'color6' => $colorsArray[5] ?? '',
            ];
            $product->colors()->updateOrCreate(['pro_id' => $product->id], $colorsData);
        }

        // Save nested Sizes relation
        if ($request->has('sizes')) {
            $sizesArray = $request->input('sizes', []);
            $sizesData = [
                'size1' => $sizesArray[0] ?? '',
                'size2' => $sizesArray[1] ?? '',
                'size3' => $sizesArray[2] ?? '',
                'size4' => $sizesArray[3] ?? '',
                'size5' => $sizesArray[4] ?? '',
                'size6' => $sizesArray[5] ?? '',
            ];
            $product->sizes()->updateOrCreate(['pro_id' => $product->id], $sizesData);
        }

        // Save nested Gallery Images relation
        if ($request->has('additional_images')) {
            $imagesArray = $request->input('additional_images', []);
            $imagesData = [
                'pro_img2' => $imagesArray[0] ?? null,
                'pro_img3' => $imagesArray[1] ?? null,
                'pro_img4' => $imagesArray[2] ?? null,
                'pro_img5' => $imagesArray[3] ?? null,
            ];
            $product->additionalImages()->updateOrCreate(['pro_id' => $product->id], $imagesData);
        }

        return $product->load(['categoryRelation', 'subcategory', 'collections', 'colors', 'sizes', 'additionalImages']);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
}
