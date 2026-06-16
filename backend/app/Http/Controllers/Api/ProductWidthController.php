<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductWidth;

class ProductWidthController extends Controller
{
    public function index()
    {
        return ProductWidth::all();
    }
}
