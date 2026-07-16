<?php

namespace App\Services;

use App\Models\User;
use App\Models\RefreshToken;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class JwtService
{
    protected string $secret;

    public function __construct()
    {
        // Fallback to a static secret if APP_KEY is empty
        $this->secret = env('JWT_SECRET', env('APP_KEY', 'default-jwt-secret-fallback-key-32-chars-long'));
    }

    /**
     * Create short-lived Access Token (JWT)
     * Expires in 15 minutes.
     *
     * @param User $user
     * @return string
     */
    public function generateAccessToken(User $user): string
    {
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        
        $payload = json_encode([
            'iss' => config('app.url'),
            'sub' => $user->id,
            'role' => $user->role,
            'email' => $user->email,
            'iat' => time(),
            'exp' => time() + 900, // 15 mins
        ]);

        $base64UrlHeader = $this->base64UrlEncode($header);
        $base64UrlPayload = $this->base64UrlEncode($payload);

        $signature = hash_hmac('sha256', "{$base64UrlHeader}.{$base64UrlPayload}", $this->secret, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);

        return "{$base64UrlHeader}.{$base64UrlPayload}.{$base64UrlSignature}";
    }

    /**
     * Create a long-lived Refresh Token in DB and return the string token.
     * Expires in 7 days.
     *
     * @param User $user
     * @return string
     */
    public function generateRefreshToken(User $user): string
    {
        $tokenString = Str::random(64);
        
        RefreshToken::create([
            'token' => $tokenString,
            'user_id' => $user->id,
            'expires_at' => now()->addDays(7),
        ]);

        return $tokenString;
    }

    /**
     * Verify the validity of a JWT Access Token.
     *
     * @param string $jwt
     * @return array|null
     */
    public function verifyAccessToken(string $jwt): ?array
    {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) {
            return null;
        }

        [$base64UrlHeader, $base64UrlPayload, $base64UrlSignature] = $parts;

        // Verify Signature
        $signature = hash_hmac('sha256', "{$base64UrlHeader}.{$base64UrlPayload}", $this->secret, true);
        $expectedSignature = $this->base64UrlEncode($signature);

        if (!hash_equals($expectedSignature, $base64UrlSignature)) {
            Log::warning('JWT signature verification failed.');
            return null;
        }

        $payload = json_decode($this->base64UrlDecode($base64UrlPayload), true);

        // Check expiration
        if (!isset($payload['exp']) || $payload['exp'] < time()) {
            Log::warning('JWT token expired.');
            return null;
        }

        return $payload;
    }

    /**
     * Rotate a Refresh Token: Verifies it, revokes it, and generates a new pair.
     *
     * @param string $tokenString
     * @return array|null
     * @throws \Exception
     */
    public function rotateRefreshToken(string $tokenString): ?array
    {
        $refreshToken = RefreshToken::where('token', $tokenString)->first();

        if (!$refreshToken || !$refreshToken->isValid()) {
            // Replay Attack Detection: If token is revoked but valid in terms of expiration,
            // it might mean someone else already used it. In this case, revoke all tokens for this user!
            if ($refreshToken && $refreshToken->is_revoked) {
                RefreshToken::where('user_id', $refreshToken->user_id)->update(['is_revoked' => true]);
                Log::alert("Replay attack detected on refresh token! Revoking all sessions for User #{$refreshToken->user_id}");
            }
            return null;
        }

        // Revoke the old token (marked rotated)
        $refreshToken->update(['is_revoked' => true]);

        // Generate new pair
        $user = $refreshToken->user;
        $newAccess = $this->generateAccessToken($user);
        $newRefresh = $this->generateRefreshToken($user);

        return [
            'access_token' => $newAccess,
            'refresh_token' => $newRefresh,
            'user' => $user
        ];
    }

    private function base64UrlEncode($data): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private function base64UrlDecode($data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }
}
