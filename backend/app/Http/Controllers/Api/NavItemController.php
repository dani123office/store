<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NavItem;
use Illuminate\Http\Request;

class NavItemController extends Controller
{
    public function index()
    {
        return NavItem::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);
        return NavItem::create($data);
    }

    public function show(NavItem $navItem)
    {
        return $navItem;
    }

    public function update(Request $request, NavItem $navItem)
    {
        $data = $request->validate([
            'label' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);
        $navItem->update($data);
        return $navItem;
    }

    public function destroy(NavItem $navItem)
    {
        $navItem->delete();
        return response()->noContent();
    }
}
