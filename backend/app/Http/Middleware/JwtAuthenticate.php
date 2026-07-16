<?php

namespace App\Http\Middleware;

use App\Services\JwtService;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class JwtAuthenticate
{
    protected JwtService $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Handle an incoming request.
     * Extracts and validates the Bearer JWT access token from headers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authorization = $request->header('Authorization');

        if (!$authorization || !str_starts_with($authorization, 'Bearer ')) {
            return response()->json(['message' => 'Unauthenticated. Bearer token missing.'], 401);
        }

        $token = substr($authorization, 7);
        $payload = $this->jwtService->verifyAccessToken($token);

        if (!$payload) {
            return response()->json(['message' => 'Unauthenticated. Token is invalid or expired.'], 401);
        }

        $user = User::find($payload['sub']);

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated. User not found.'], 401);
        }

        // Set authenticated user in Laravel request context
        Auth::setUser($user);

        return $next($request);
    }
}
