<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminDashboardController extends Controller
{
    use ApiResponse;

    /**
     * Get aggregate sales analytics (revenue, top products, low stock alerts).
     */
    public function salesAnalytics(Request $request)
    {
        $days = intval($request->input('days', 30));

        // 1. Revenue aggregate grouped by date
        $revenueData = Order::where('orderStatus', '!=', Order::STATUS_CANCELLED)
            ->where('created_at', '>=', now()->subDays($days))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(subtotal) as daily_revenue'),
                DB::raw('COUNT(id) as daily_orders')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // 2. Top-selling products from order_items table
        $topProducts = DB::table('order_items')
            ->select(
                'product_title',
                DB::raw('SUM(qty) as units_sold'),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('product_title')
            ->orderBy('units_sold', 'desc')
            ->limit(5)
            ->get();

        // 3. Low stock report (combines products & variants)
        $lowStockProducts = Product::where('stock', '<=', 5)->select('id', 'title', 'sku', 'stock')->get();
        $lowStockVariants = ProductVariant::lowStock()->with('product')->get()->map(function ($v) {
            return [
                'id' => $v->id,
                'title' => ($v->product->title ?? 'Unknown') . " ({$v->size} - {$v->color})",
                'sku' => $v->sku,
                'stock' => $v->stock,
            ];
        });

        $lowStockReport = $lowStockProducts->concat($lowStockVariants);

        // Summary metrics
        $totalRevenue = Order::where('orderStatus', '!=', Order::STATUS_CANCELLED)->sum('subtotal');
        $totalOrders = Order::count();

        return $this->successResponse([
            'metrics' => [
                'total_revenue' => floatval($totalRevenue),
                'total_orders' => $totalOrders,
            ],
            'revenue_timeline' => $revenueData,
            'top_products' => $topProducts,
            'low_stock_alerts' => $lowStockReport
        ], 'Sales analytics processed successfully.');
    }

    /**
     * Export the products list as a streamable CSV download.
     */
    public function exportProductsCsv(): StreamedResponse
    {
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=products_export_' . date('Y-m-d') . '.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function() {
            $file = fopen('php://output', 'w');
            
            // Header Row
            fputcsv($file, ['ID', 'SKU', 'Title', 'Price', 'Stock', 'Category', 'Created At']);

            // Fetch and stream in chunks (prevents memory exhaust)
            Product::with('categoryRelation')->chunk(100, function($products) use ($file) {
                foreach ($products as $p) {
                    fputcsv($file, [
                        $p->id,
                        $p->sku,
                        $p->title,
                        $p->price,
                        $p->stock,
                        $p->categoryRelation->cat_title ?? 'Uncategorized',
                        $p->created_at->toDateTimeString()
                    ]);
                }
            });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Import products in bulk from a CSV file.
     */
    public function importProductsCsv(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $filePath = $request->file('file')->getRealPath();
        $file = fopen($filePath, 'r');

        $header = fgetcsv($file);
        // Normalize headings (trim and lowercase)
        $headings = array_map(fn($h) => strtolower(trim($h)), $header);

        // Required headings check
        $required = ['sku', 'title', 'price', 'stock'];
        foreach ($required as $req) {
            if (!in_array($req, $headings)) {
                fclose($file);
                return $this->errorResponse("Missing required CSV column heading: {$req}", 422);
            }
        }

        $importCount = 0;

        try {
            DB::transaction(function () use ($file, $headings, &$importCount) {
                while (($row = fgetcsv($file)) !== false) {
                    $data = array_combine($headings, $row);
                    
                    $sku = trim($data['sku']);
                    if (empty($sku)) continue;

                    Product::updateOrCreate(
                        ['sku' => $sku],
                        [
                            'title' => strip_tags(trim($data['title'])),
                            'price' => floatval($data['price']),
                            'stock' => intval($data['stock']),
                        ]
                    );

                    $importCount++;
                }
            });

            fclose($file);

            // Invalidate products lists cache
            Cache::increment('products_cache_version');

            return $this->successResponse(
                ['imported_count' => $importCount],
                "Bulk import completed successfully. Processed {$importCount} records."
            );

        } catch (\Exception $e) {
            fclose($file);
            Log::error("Bulk product CSV import failed: " . $e->getMessage());
            return $this->errorResponse("CSV parse error: " . $e->getMessage(), 500);
        }
    }
}
