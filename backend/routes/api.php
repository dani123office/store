<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SubCategoryController;
use App\Http\Controllers\Api\CatItemController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\CPageController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\TaxController;
use App\Http\Controllers\Api\StaffAreaController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\AdminMenuController;
use App\Http\Controllers\Api\AdminMenuItemController;
use App\Http\Controllers\Api\EmarketController;
use App\Http\Controllers\Api\CTimelineController;
use App\Http\Controllers\Api\OTimelineController;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\ViewCountController;
use App\Http\Controllers\Api\ProductColorController;
use App\Http\Controllers\Api\ProductImageController;
use App\Http\Controllers\Api\ProductSizeController;
use App\Http\Controllers\Api\ProductWidthController;
use App\Http\Controllers\Api\NavItemController;
use App\Http\Controllers\Api\AdminLoginController;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::apiResource('/products', ProductController::class);
Route::apiResource('/users', UserController::class);
Route::apiResource('/orders', OrderController::class);
Route::apiResource('/categories', CategoryController::class);
Route::apiResource('/sub-categories', SubCategoryController::class);
Route::apiResource('/cat-items', CatItemController::class);
Route::apiResource('/carts', CartController::class);
Route::apiResource('/admin-logins', AdminLoginController::class);
Route::apiResource('/c-pages', CPageController::class);
Route::apiResource('/admin-menus', AdminMenuController::class);
Route::apiResource('/admin-menu-items', AdminMenuItemController::class);
Route::apiResource('/notifications', NotificationController::class);
Route::apiResource('/nav-items', NavItemController::class);

Route::get('/taxes', [TaxController::class, 'index']);
Route::get('/taxes/{tax}', [TaxController::class, 'show']);
Route::put('/taxes/{tax}', [TaxController::class, 'update']);

Route::get('/db-migrate-custom', function () {
    try {
        if (!\Illuminate\Support\Facades\Schema::hasColumn('stores', 'theme_settings')) {
            \Illuminate\Support\Facades\Schema::table('stores', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->text('theme_settings')->nullable();
            });
            return response()->json(['status' => 'success', 'message' => 'theme_settings column added successfully.']);
        }
        return response()->json(['status' => 'success', 'message' => 'theme_settings column already exists.']);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
    }
});

Route::get('/db-migrate-custom-v2', function () {
    try {
        if (!\Illuminate\Support\Facades\Schema::hasTable('coupons')) {
            \Illuminate\Support\Facades\Schema::create('coupons', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->id();
                $table->string('code')->unique();
                $table->string('type'); // Percentage / Fixed Amount
                $table->double('value');
                $table->string('status'); // Active / Expired
                $table->string('expiry_date')->nullable();
                $table->timestamps();
            });

            // Seed initial coupons
            \Illuminate\Support\Facades\DB::table('coupons')->insert([
                [
                    'code' => 'WELCOME10',
                    'type' => 'Percentage',
                    'value' => 10,
                    'status' => 'Active',
                    'expiry_date' => '2026-12-31',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'code' => 'EIDMUBARAK',
                    'type' => 'Fixed Amount',
                    'value' => 1000,
                    'status' => 'Active',
                    'expiry_date' => '2026-07-15',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ]);

            return response()->json(['status' => 'success', 'message' => 'coupons table created and seeded successfully.']);
        }
        return response()->json(['status' => 'success', 'message' => 'coupons table already exists.']);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
    }
});

// Coupons Database CRUD
Route::get('/db-coupons', function () {
    return response()->json(\Illuminate\Support\Facades\DB::table('coupons')->get());
});

Route::post('/db-coupons', function (\Illuminate\Http\Request $request) {
    try {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'type' => 'required|string',
            'value' => 'required|numeric',
            'expiry_date' => 'nullable|string',
        ]);
        
        $id = \Illuminate\Support\Facades\DB::table('coupons')->insertGetId([
            'code' => strtoupper(str_replace(' ', '', $validated['code'])),
            'type' => $validated['type'],
            'value' => $validated['value'],
            'status' => 'Active',
            'expiry_date' => $validated['expiry_date'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        $newCoupon = \Illuminate\Support\Facades\DB::table('coupons')->where('id', $id)->first();
        return response()->json($newCoupon, 201);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
});

Route::put('/db-coupons/{id}', function (\Illuminate\Http\Request $request, $id) {
    try {
        $coupon = \Illuminate\Support\Facades\DB::table('coupons')->where('id', $id)->first();
        if (!$coupon) {
            return response()->json(['error' => 'Coupon not found'], 404);
        }
        $newStatus = $coupon->status === 'Active' ? 'Expired' : 'Active';
        \Illuminate\Support\Facades\DB::table('coupons')->where('id', $id)->update([
            'status' => $newStatus,
            'updated_at' => now(),
        ]);
        return response()->json(['status' => 'success', 'new_status' => $newStatus]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
});

Route::delete('/db-coupons/{id}', function ($id) {
    \Illuminate\Support\Facades\DB::table('coupons')->where('id', $id)->delete();
    return response()->json(['status' => 'success']);
});

Route::get('/stores', [StoreController::class, 'index']);
Route::get('/stores/{store}', [StoreController::class, 'show']);
Route::put('/stores/{store}', [StoreController::class, 'update']);
Route::post('/stores', [StoreController::class, 'store']);

Route::get('/addresses', [AddressController::class, 'index']);
Route::get('/payments', [PaymentController::class, 'index']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/staff-areas', [StaffAreaController::class, 'index']);
Route::get('/roles', [RoleController::class, 'index']);
Route::get('/emarkets', [EmarketController::class, 'index']);
Route::get('/c-timelines', [CTimelineController::class, 'index']);
Route::get('/o-timelines', [OTimelineController::class, 'index']);
Route::get('/collections', [CollectionController::class, 'index']);
Route::get('/view-counts', [ViewCountController::class, 'index']);
Route::get('/product-colors', [ProductColorController::class, 'index']);
Route::get('/product-images', [ProductImageController::class, 'index']);
Route::get('/product-sizes', [ProductSizeController::class, 'index']);
Route::get('/product-widths', [ProductWidthController::class, 'index']);

Route::post('/upload', [App\Http\Controllers\Api\UploadController::class, 'store']);
