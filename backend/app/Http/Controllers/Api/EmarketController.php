<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Emarket;

class EmarketController extends Controller
{
    public function index()
    {
        return Emarket::all();
    }
}
