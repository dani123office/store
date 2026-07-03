# Security Headers Fix Plan

## Changes

- `backend/bootstrap/app.php` — Appended `SecurityHeadersMiddleware` globally to run on every request.

## New files

- `backend/app/Http/Middleware/SecurityHeadersMiddleware.php` — Class created to inject standard headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) on all HTTP responses.

## Verification goals

After implementation, ALL of these must be true:

- [x] Every response returns `Content-Security-Policy: default-src 'self'`.
- [x] Every response returns `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
- [x] Every response returns `X-Frame-Options: DENY`.
- [x] Every response returns `X-Content-Type-Options: nosniff`.
- [x] Every response returns `Referrer-Policy: strict-origin-when-cross-origin`.

## Manual verification (for the human)

- Run `curl -I http://localhost:8000/api/products` (or your dev server URL) and verify that the security headers are returned in the response headers.
