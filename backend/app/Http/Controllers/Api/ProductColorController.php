<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductColor;

class ProductColorController extends Controller
{
    public function index()
    {
        return ProductColor::all();
    }
}
