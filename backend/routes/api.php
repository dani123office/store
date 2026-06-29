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
Route::apiResource('/collections', CollectionController::class);

Route::get('/taxes', [TaxController::class, 'index']);
Route::get('/taxes/{tax}', [TaxController::class, 'show']);
Route::put('/taxes/{tax}', [TaxController::class, 'update']);

Route::get('/db-migrate-custom', function () {
    try {
        $messages = [];
        if (!\Illuminate\Support\Facades\Schema::hasColumn('stores', 'theme_settings')) {
            \Illuminate\Support\Facades\Schema::table('stores', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->text('theme_settings')->nullable();
            });
            $messages[] = 'theme_settings column added to stores.';
        }
        if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'description')) {
            \Illuminate\Support\Facades\Schema::table('products', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->text('description')->nullable();
            });
            $messages[] = 'description column added to products.';
        }
        return response()->json([
            'status' => 'success',
            'message' => empty($messages) ? 'migrations already up to date.' : implode(' ', $messages)
        ]);
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
Route::get('/view-counts', [ViewCountController::class, 'index']);
Route::get('/product-colors', [ProductColorController::class, 'index']);
Route::get('/product-images', [ProductImageController::class, 'index']);
Route::get('/product-sizes', [ProductSizeController::class, 'index']);
Route::get('/product-widths', [ProductWidthController::class, 'index']);

Route::post('/upload', [App\Http\Controllers\Api\UploadController::class, 'store']);
Route::get('/media', [App\Http\Controllers\Api\MediaController::class, 'index']);
Route::delete('/media/{filename}', [App\Http\Controllers\Api\MediaController::class, 'destroy'])->where('filename', '.*');

Route::get('/db-migrate-custom-v3', function () {
    try {
        $messages = [];
        
        // 1. Add columns to stores table
        \Illuminate\Support\Facades\Schema::table('stores', function (\Illuminate\Database\Schema\Blueprint $table) use (&$messages) {
            if (!\Illuminate\Support\Facades\Schema::hasColumn('stores', 'installed_apps')) {
                $table->text('installed_apps')->nullable();
                $messages[] = 'installed_apps column added to stores.';
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('stores', 'fb_pixel_id')) {
                $table->text('fb_pixel_id')->nullable();
                $messages[] = 'fb_pixel_id column added to stores.';
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('stores', 'fb_connected')) {
                $table->boolean('fb_connected')->default(false);
                $messages[] = 'fb_connected column added to stores.';
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('stores', 'fb_access_token')) {
                $table->text('fb_access_token')->nullable();
                $messages[] = 'fb_access_token column added to stores.';
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('stores', 'fb_business_manager')) {
                $table->text('fb_business_manager')->nullable();
                $messages[] = 'fb_business_manager column added to stores.';
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('stores', 'fb_ad_account')) {
                $table->text('fb_ad_account')->nullable();
                $messages[] = 'fb_ad_account column added to stores.';
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('stores', 'fb_page')) {
                $table->text('fb_page')->nullable();
                $messages[] = 'fb_page column added to stores.';
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('stores', 'fb_data_sharing')) {
                $table->text('fb_data_sharing')->nullable();
                $messages[] = 'fb_data_sharing column added to stores.';
            }
        });

        // 2. Create marketing_campaigns table
        if (!\Illuminate\Support\Facades\Schema::hasTable('marketing_campaigns')) {
            \Illuminate\Support\Facades\Schema::create('marketing_campaigns', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->id();
                $table->string('name', 255);
                $table->string('channel', 255);
                $table->string('status', 255);
                $table->string('budget', 255)->nullable();
                $table->string('revenue', 255)->nullable();
                $table->timestamps();
            });
            
            // Seed default campaigns
            \Illuminate\Support\Facades\DB::table('marketing_campaigns')->insert([
                [
                    'name' => 'Summer Launch Newsletter',
                    'channel' => 'Email',
                    'status' => 'Active',
                    'budget' => 'Rs.5,000',
                    'revenue' => 'Rs.45,000',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Instagram Festive Ads',
                    'channel' => 'Instagram',
                    'status' => 'Active',
                    'budget' => 'Rs.25,000',
                    'revenue' => 'Rs.180,000',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Eid Collection SMS Promo',
                    'channel' => 'SMS',
                    'status' => 'Completed',
                    'budget' => 'Rs.8,000',
                    'revenue' => 'Rs.62,000',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ]);
            $messages[] = 'marketing_campaigns table created and seeded successfully.';
        }

        return response()->json([
            'status' => 'success',
            'message' => empty($messages) ? 'v3 migrations already up to date.' : implode(' ', $messages)
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
    }
});

// Marketing Campaigns DB CRUD
Route::get('/marketing-campaigns', function () {
    return response()->json(\Illuminate\Support\Facades\DB::table('marketing_campaigns')->orderBy('id', 'desc')->get());
});

Route::post('/marketing-campaigns', function (\Illuminate\Http\Request $request) {
    try {
        $validated = $request->validate([
            'name' => 'required|string',
            'channel' => 'required|string',
            'status' => 'required|string',
            'budget' => 'nullable|string',
            'revenue' => 'nullable|string',
        ]);
        
        $id = \Illuminate\Support\Facades\DB::table('marketing_campaigns')->insertGetId([
            'name' => $validated['name'],
            'channel' => $validated['channel'],
            'status' => $validated['status'],
            'budget' => $validated['budget'] ?? 'Rs.0',
            'revenue' => $validated['revenue'] ?? 'Rs.0',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        $newCamp = \Illuminate\Support\Facades\DB::table('marketing_campaigns')->where('id', $id)->first();
        return response()->json($newCamp, 201);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
});

Route::put('/marketing-campaigns/{id}', function (\Illuminate\Http\Request $request, $id) {
    try {
        $data = $request->only(['name', 'channel', 'status', 'budget', 'revenue']);
        $data['updated_at'] = now();
        \Illuminate\Support\Facades\DB::table('marketing_campaigns')->where('id', $id)->update($data);
        $updated = \Illuminate\Support\Facades\DB::table('marketing_campaigns')->where('id', $id)->first();
        return response()->json($updated);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
});

Route::delete('/marketing-campaigns/{id}', function ($id) {
    \Illuminate\Support\Facades\DB::table('marketing_campaigns')->where('id', $id)->delete();
    return response()->json(['status' => 'success']);
});

Route::get('/db-migrate-custom-v4', function () {
    try {
        $messages = [];
        \Illuminate\Support\Facades\Schema::table('stores', function (\Illuminate\Database\Schema\Blueprint $table) use (&$messages) {
            if (!\Illuminate\Support\Facades\Schema::hasColumn('stores', 'seo_settings')) {
                $table->text('seo_settings')->nullable();
                $messages[] = 'seo_settings column added to stores.';
            }
        });
        return response()->json([
            'status' => 'success',
            'message' => empty($messages) ? 'v4 migrations already up to date.' : implode(' ', $messages)
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
    }
});

Route::get('/db-migrate-custom-v5', function () {
    try {
        $messages = [];
        if (!\Illuminate\Support\Facades\Schema::hasTable('apps')) {
            \Illuminate\Support\Facades\Schema::create('apps', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('category');
                $table->text('description');
                $table->string('developer');
                $table->string('logo')->nullable();
                $table->string('link')->nullable();
                $table->timestamps();
            });

            // Seed default apps
            \Illuminate\Support\Facades\DB::table('apps')->insert([
                [
                    'name' => 'Zarka Inbox',
                    'category' => 'Customer Service',
                    'description' => 'Real-time customer chat and support messages.',
                    'developer' => 'Zarka Couture',
                    'logo' => '',
                    'link' => '',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Judge.me Product Reviews',
                    'category' => 'Social Proof',
                    'description' => 'Collect and display product reviews and ratings.',
                    'developer' => 'Judge.me',
                    'logo' => '',
                    'link' => '',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Mailchimp Email Marketing',
                    'category' => 'Marketing',
                    'description' => 'Sync customer lists and build automated campaigns.',
                    'developer' => 'Mailchimp',
                    'logo' => '',
                    'link' => '',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'ShipRocket Delivery Integration',
                    'category' => 'Shipping & Fulfillment',
                    'description' => 'Fulfill orders with reliable local couriers.',
                    'developer' => 'ShipRocket',
                    'logo' => '',
                    'link' => '',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Pixel Conversion Booster',
                    'category' => 'Analytics',
                    'description' => 'Advanced Facebook Pixel and analytics tracking.',
                    'developer' => 'PixelInc',
                    'logo' => '',
                    'link' => '/admin/preferences',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);

            $messages[] = 'apps table created and seeded successfully.';
        }

        return response()->json([
            'status' => 'success',
            'message' => empty($messages) ? 'v5 migrations already up to date.' : implode(' ', $messages)
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
    }
});

// Apps list API CRUD
Route::get('/apps-list', function () {
    return response()->json(\Illuminate\Support\Facades\DB::table('apps')->orderBy('id', 'asc')->get());
});

Route::post('/apps-list', function (\Illuminate\Http\Request $request) {
    try {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'description' => 'required|string',
            'developer' => 'required|string',
            'link' => 'nullable|string',
        ]);
        
        $id = \Illuminate\Support\Facades\DB::table('apps')->insertGetId([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'developer' => $validated['developer'],
            'logo' => '',
            'link' => $validated['link'] ?? '',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        $newApp = \Illuminate\Support\Facades\DB::table('apps')->where('id', $id)->first();
        return response()->json($newApp, 201);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
});

Route::delete('/apps-list/{id}', function ($id) {
    \Illuminate\Support\Facades\DB::table('apps')->where('id', $id)->delete();
    return response()->json(['status' => 'success']);
});


