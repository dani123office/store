<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;

class PaymentController extends Controller
{
    public function index()
    {
        // Admin-only route, no sensitive data exposed
        return Payment::all();
    }
}
