<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductSize;

class ProductSizeController extends Controller
{
    public function index()
    {
        return ProductSize::all();
    }
}
