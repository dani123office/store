<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CTimeline;

class CTimelineController extends Controller
{
    public function index()
    {
        return CTimeline::all();
    }
}
