<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    protected JwtService $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Authenticate user and return access token + refresh token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|string|max:255',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Generate tokens (with rotation)
        $accessToken = $this->jwtService->generateAccessToken($user);
        $refreshToken = $this->jwtService->generateRefreshToken($user);

        return response()->json([
            'id' => (string) $user->id,
            'name' => $user->name,
            'lastname' => $user->lastname,
            'email' => $user->email,
            'role' => $user->role,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
        ]);
    }

    /**
     * Register a new customer and return initial tokens.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'lastname' => 'required|string|max:50',
            'email' => 'required|email|string|max:255|unique:users,email',
            'password' => 'required|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/', // Strict pwd strength
        ]);

        $user = User::create([
            'name' => strip_tags($request->name), // Strict XSS sanitization
            'lastname' => strip_tags($request->lastname),
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer',
        ]);

        $accessToken = $this->jwtService->generateAccessToken($user);
        $refreshToken = $this->jwtService->generateRefreshToken($user);

        return response()->json([
            'id' => (string) $user->id,
            'name' => $user->name,
            'lastname' => $user->lastname,
            'email' => $user->email,
            'role' => $user->role,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
        ], 201);
    }

    /**
     * Rotate the Refresh Token to get a fresh Access Token + rotated Refresh Token.
     */
    public function refresh(Request $request)
    {
        $request->validate([
            'refresh_token' => 'required|string',
        ]);

        try {
            $tokens = $this->jwtService->rotateRefreshToken($request->input('refresh_token'));

            if (!$tokens) {
                return response()->json(['message' => 'Invalid or expired refresh token.'], 401);
            }

            return response()->json([
                'access_token' => $tokens['access_token'],
                'refresh_token' => $tokens['refresh_token'],
                'role' => $tokens['user']->role,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Refresh operation failed.'], 500);
        }
    }
}
