<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    use ApiResponse;

    /**
     * Fetch paginated list of products with dynamic sorting, filtering, and version-based caching.
     */
    public function index(Request $request)
    {
        $page = intval($request->input('page', 1));
        $limit = intval($request->input('per_page', 12));
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = strtolower($request->input('sort_order', 'desc')) === 'asc' ? 'asc' : 'desc';

        // Filters
        $categoryId = $request->input('category_id');
        $subcategoryId = $request->input('subcategory_id');
        $search = $request->input('search');
        $priceMin = $request->input('price_min');
        $priceMax = $request->input('price_max');

        // Cache Versioning (Buster) Pattern:
        // Incrementing this key invalidates all previous keys instantly across all cache drivers (File/Redis).
        $cacheVersion = Cache::rememberForever('products_cache_version', fn () => 1);

        $filterHash = md5(json_encode([
            $categoryId, $subcategoryId, $search, $priceMin, $priceMax
        ]));

        $cacheKey = "products:v{$cacheVersion}:page_{$page}:limit_{$limit}:sort_{$sortBy}_{$sortOrder}:filters_{$filterHash}";

        $paginatedProducts = Cache::remember($cacheKey, 3600, function () use (
            $categoryId, $subcategoryId, $search, $priceMin, $priceMax, $sortBy, $sortOrder, $limit
        ) {
            $query = Product::with(['categoryRelation', 'subcategory', 'collections', 'colors', 'sizes', 'additionalImages']);

            // Apply filters
            if ($categoryId) {
                $query->where('category_id', $categoryId);
            }
            if ($subcategoryId) {
                $query->where('subcategory_id', $subcategoryId);
            }
            if ($search) {
                $query->where('title', 'like', "%{$search}%");
            }
            if ($priceMin !== null) {
                $query->where('price', '>=', floatval($priceMin));
            }
            if ($priceMax !== null) {
                $query->where('price', '<=', floatval($priceMax));
            }

            // Validate and apply sorting
            $allowedSorts = ['price', 'popularity', 'created_at', 'stock'];
            if (in_array($sortBy, $allowedSorts)) {
                $query->orderBy($sortBy, $sortOrder);
            } else {
                $query->orderBy('created_at', 'desc');
            }

            return $query->paginate($limit);
        });

        return $this->paginatedResponse($paginatedProducts, 'Products list fetched successfully.');
    }

    public function store(Request $request)
    {
        $input = $request->except(['collection_ids', 'colors', 'sizes', 'additional_images']);
        
        if (isset($input['category_id'])) {
            $cat = DB::table('categories')->where('cat_id', $input['category_id'])->first();
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

        $this->clearProductCache(); // Cache bust

        return $this->successResponse(
            $product->load(['categoryRelation', 'subcategory', 'collections', 'colors', 'sizes', 'additionalImages']),
            'Product created successfully.',
            201
        );
    }

    public function show(Product $product)
    {
        $data = $product->load(['categoryRelation', 'subcategory', 'collections', 'colors', 'sizes', 'additionalImages']);
        return $this->successResponse($data, 'Product details fetched successfully.');
    }

    public function update(Request $request, Product $product)
    {
        $input = $request->except(['collection_ids', 'colors', 'sizes', 'additional_images']);
        
        if (isset($input['category_id'])) {
            $cat = DB::table('categories')->where('cat_id', $input['category_id'])->first();
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

        $this->clearProductCache(); // Cache bust

        return $this->successResponse(
            $product->load(['categoryRelation', 'subcategory', 'collections', 'colors', 'sizes', 'additionalImages']),
            'Product updated successfully.'
        );
    }

    public function destroy(Product $product)
    {
        $product->delete();
        $this->clearProductCache(); // Cache bust
        return $this->successResponse(null, 'Product deleted successfully.');
    }

    /**
     * Cache Busting: Increment the version key to immediately render all cached product listing pages stale.
     */
    protected function clearProductCache(): void
    {
        try {
            Cache::increment('products_cache_version');
        } catch (\Exception $e) {
            Log::error("Failed to increment product cache version: " . $e->getMessage());
        }
    }
}
