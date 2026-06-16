<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminLogin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminLoginController extends Controller
{
    public function index()
    {
        return AdminLogin::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return AdminLogin::create($data);
    }

    public function show(AdminLogin $adminLogin)
    {
        return $adminLogin;
    }

    public function update(Request $request, AdminLogin $adminLogin)
    {
        $data = $request->all();
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        $adminLogin->update($data);
        return $adminLogin;
    }

    public function destroy(AdminLogin $adminLogin)
    {
        $adminLogin->delete();
        return response()->noContent();
    }
}
