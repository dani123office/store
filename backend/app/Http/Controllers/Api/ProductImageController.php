<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductImage;

class ProductImageController extends Controller
{
    public function index()
    {
        return ProductImage::all();
    }
}
