<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of users (Admin only).
     */
    public function index()
    {
        $users = User::all()->makeHidden(['password']);
        return $this->successResponse($users, 'Users fetched successfully.');
    }

    /**
     * Store a newly created user in storage (Admin only).
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'lastname' => 'required|string|max:50',
            'email' => 'required|email|string|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:customer,staff,admin',
        ]);

        $user = User::create([
            'name' => strip_tags($request->name),
            'lastname' => strip_tags($request->lastname),
            'email' => $request->email,
            'password' => $request->password, // Hashed automatically by 'password' => 'hashed' model cast
            'role' => $request->role,
        ]);

        return $this->successResponse(
            $user->fresh()->makeHidden(['password']),
            'User created successfully.',
            201
        );
    }

    /**
     * Display the specified user profile.
     */
    public function show(User $user)
    {
        $currUser = request()->user();

        // Prevent non-admin users from viewing other profiles
        if ($currUser->role !== 'admin' && $user->id !== $currUser->id) {
            return $this->errorResponse('Forbidden. You cannot view this profile.', 403);
        }

        return $this->successResponse($user->makeHidden(['password']), 'User details fetched successfully.');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $currUser = request()->user();

        // Authorization check
        if ($currUser->role !== 'admin' && $user->id !== $currUser->id) {
            return $this->errorResponse('Forbidden. You cannot edit this profile.', 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:50',
            'lastname' => 'sometimes|required|string|max:50',
            'email' => 'sometimes|required|email|string|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|required|in:customer,staff,admin',
        ]);

        $data = [];
        if ($request->has('name')) $data['name'] = strip_tags($request->name);
        if ($request->has('lastname')) $data['lastname'] = strip_tags($request->lastname);
        if ($request->has('email')) $data['email'] = $request->email;
        
        // Prevent customers/staff from escalating their own role to admin
        if ($request->has('role') && $currUser->role === 'admin') {
            $data['role'] = $request->role;
        }

        if ($request->filled('password')) {
            $data['password'] = $request->password; // Will be hashed by model cast automatically
        }

        $user->update($data);

        return $this->successResponse(
            $user->fresh()->makeHidden(['password']),
            'User profile updated successfully.'
        );
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $currUser = request()->user();

        // Authorization check
        if ($currUser->role !== 'admin' && $user->id !== $currUser->id) {
            return $this->errorResponse('Forbidden. You cannot delete this user.', 403);
        }

        // Prevent self-deletion of the last admin
        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return $this->errorResponse('Forbidden. Cannot delete the only remaining Admin account.', 400);
        }

        $user->delete();

        return $this->successResponse(null, 'User account deleted successfully.');
    }
}
