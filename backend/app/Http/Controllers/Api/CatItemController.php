<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatItem;
use Illuminate\Http\Request;

class CatItemController extends Controller
{
    public function index()
    {
        return CatItem::all();
    }

    public function store(Request $request)
    {
        return CatItem::create($request->all());
    }

    public function show(CatItem $catItem)
    {
        return $catItem;
    }

    public function update(Request $request, CatItem $catItem)
    {
        $catItem->update($request->all());
        return $catItem;
    }

    public function destroy(CatItem $catItem)
    {
        $catItem->delete();
        return response()->noContent();
    }
}
