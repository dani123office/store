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

Route::get('/taxes', [TaxController::class, 'index']);
Route::get('/taxes/{tax}', [TaxController::class, 'show']);
Route::put('/taxes/{tax}', [TaxController::class, 'update']);

Route::get('/stores', [StoreController::class, 'index']);
Route::get('/stores/{store}', [StoreController::class, 'show']);
Route::put('/stores/{store}', [StoreController::class, 'update']);
Route::post('/stores', [StoreController::class, 'store']);

Route::get('/addresses', [AddressController::class, 'index']);
Route::get('/payments', [PaymentController::class, 'index']);
Route::get('/reviews', [ReviewController::class, 'index']);
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
