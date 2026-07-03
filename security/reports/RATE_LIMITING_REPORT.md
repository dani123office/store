# Rate Limiting Security Report

## Status: PASS

## Findings

Rate limiting is configured in `backend/app/Providers/AppServiceProvider.php`:

```php
RateLimiter::for('api', fn ($request) => Limit::perMinute(120)->by($request->ip()));
RateLimiter::for('auth', fn ($request) => Limit::perMinute(10)->by($request->ip()));
```

Applied in `backend/routes/api.php`:
- `/auth/login` and `/auth/register` use `throttle:auth` (10/min).
- All other routes use `throttle:api` (120/min).

Rate limiter keys by IP address — simple but effective. Scoped per-IP, not per-route.

## What's at risk

Without rate limiting, brute-force attacks on login/register endpoints are possible. Currently mitigated.

## What's already secure

- Auth endpoints: 10 requests/minute/IP limit.
- API endpoints: 120 requests/minute/IP limit.
- Rate limiter configured server-side, cannot be bypassed client-side.

## Recommendations

- Consider using `$request->ip()` vs trusted proxy IP for production behind load balancers.
- For enhanced security, consider per-user rate limiting after authentication (using `$request->user()?->id`).
