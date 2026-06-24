<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $user = User::create($data);
        $user = $user->fresh();
        $user->id = (string) $user->id;
        return $user;
    }

    public function show(User $user)
    {
        $user->id = (string) $user->id;
        return $user;
    }

    public function update(Request $request, User $user)
    {
        $data = $request->all();
        if (array_key_exists('password', $data) && ($data['password'] === null || $data['password'] === '')) {
            unset($data['password']);
        }
        $user->update($data);
        $user = $user->fresh();
        $user->id = (string) $user->id;
        return $user;
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->noContent();
    }
}
