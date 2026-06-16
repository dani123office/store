<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OTimeline;

class OTimelineController extends Controller
{
    public function index()
    {
        return OTimeline::all();
    }
}
