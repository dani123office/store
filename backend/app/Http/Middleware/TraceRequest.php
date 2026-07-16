<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class TraceRequest
{
    /**
     * Handle an incoming request.
     * Generates a unique Request ID for log context tracing and response header mapping.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get existing request ID from load balancer / proxy or generate a new UUID
        $requestId = $request->header('X-Request-Id') ?? (string) Str::uuid();

        // Share the Request ID context globally with Laravel's Logging Engine.
        // This automatically appends ['request_id' => $requestId] to all Log::info/error entries in this thread.
        if (method_exists(Log::class, 'shareContext')) {
            Log::shareContext([
                'request_id' => $requestId
            ]);
        }

        // Attach request ID to request parameters for easy controller retrieval if needed
        $request->attributes->set('request_id', $requestId);

        $response = $next($request);

        // Inject request ID to response header for client-side tracing
        $response->headers->set('X-Request-Id', $requestId);

        return $response;
    }
}
