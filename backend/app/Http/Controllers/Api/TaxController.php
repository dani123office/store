<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tax;
use Illuminate\Http\Request;

class TaxController extends Controller
{
    public function index()
    {
        return Tax::all();
    }

    public function show(Tax $tax)
    {
        return $tax;
    }

    public function update(Request $request, Tax $tax)
    {
        $tax->update($request->all());
        return $tax;
    }
}
