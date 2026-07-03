<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::all()->makeHidden(['password']);
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
        $currUser = request()->user();
        if ($currUser->role !== 'admin' && $user->id !== $currUser->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $user->id = (string) $user->id;
        return $user;
    }

    public function update(Request $request, User $user)
    {
        $currUser = request()->user();
        if ($currUser->role !== 'admin' && $user->id !== $currUser->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $data = $request->all();
        if (array_key_exists('password', $data)) {
            if ($data['password'] === null || $data['password'] === '') {
                unset($data['password']);
            } else {
                $data['password'] = \Illuminate\Support\Facades\Hash::make($data['password']);
            }
        }
        $user->update($data);
        $user = $user->fresh();
        $user->id = (string) $user->id;
        return $user;
    }

    public function destroy(User $user)
    {
        $currUser = request()->user();
        if ($currUser->role !== 'admin' && $user->id !== $currUser->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $user->delete();
        return response()->noContent();
    }
}
