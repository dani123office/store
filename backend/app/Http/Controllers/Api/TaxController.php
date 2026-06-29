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

    public function show($id)
    {
        return Tax::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $tax = Tax::findOrFail($id);
        $tax->update($request->all());
        return $tax;
    }

    public function store(Request $request)
    {
        return Tax::create($request->all());
    }
}
