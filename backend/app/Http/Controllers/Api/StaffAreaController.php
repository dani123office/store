<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaffArea;

class StaffAreaController extends Controller
{
    public function index()
    {
        return StaffArea::all();
    }
}
