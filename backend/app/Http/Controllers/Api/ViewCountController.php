<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ViewCount;

class ViewCountController extends Controller
{
    public function index()
    {
        return ViewCount::all();
    }
}
