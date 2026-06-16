<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminMenuItem;
use Illuminate\Http\Request;

class AdminMenuItemController extends Controller
{
    public function index()
    {
        return AdminMenuItem::all();
    }

    public function store(Request $request)
    {
        return AdminMenuItem::create($request->all());
    }

    public function show(AdminMenuItem $adminMenuItem)
    {
        return $adminMenuItem;
    }

    public function update(Request $request, AdminMenuItem $adminMenuItem)
    {
        $adminMenuItem->update($request->all());
        return $adminMenuItem;
    }

    public function destroy(AdminMenuItem $adminMenuItem)
    {
        $adminMenuItem->delete();
        return response()->noContent();
    }
}
