<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminMenu;
use Illuminate\Http\Request;

class AdminMenuController extends Controller
{
    public function index()
    {
        return AdminMenu::all();
    }

    public function store(Request $request)
    {
        return AdminMenu::create($request->all());
    }

    public function show(AdminMenu $adminMenu)
    {
        return $adminMenu;
    }

    public function update(Request $request, AdminMenu $adminMenu)
    {
        $adminMenu->update($request->all());
        return $adminMenu;
    }

    public function destroy(AdminMenu $adminMenu)
    {
        $adminMenu->delete();
        return response()->noContent();
    }
}
