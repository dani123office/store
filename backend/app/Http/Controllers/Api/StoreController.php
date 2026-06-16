<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index()
    {
        return Store::all();
    }

    public function show(Store $store)
    {
        return $store;
    }

    public function update(Request $request, Store $store)
    {
        $store->update($request->all());
        return $store;
    }

    public function store(Request $request)
    {
        $store = Store::first();
        if ($store) {
            $store->update($request->all());
            return $store;
        }
        return Store::create($request->all());
    }
}
