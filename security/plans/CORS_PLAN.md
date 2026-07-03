# CORS Fix Plan

## Changes

- `backend/config/cors.php` — Restrict allowed origins to domains configured in environment variable `ALLOWED_CORS_ORIGINS`.
- `backend/.env` — Added `ALLOWED_CORS_ORIGINS` configuration.
- `backend/.env.example` — Added `ALLOWED_CORS_ORIGINS` template variable.

## New files

None.

## Verification goals

After implementation, ALL of these must be true:

- [x] CORS allowed origins do not contain a wildcard `*`.
- [x] Configured origins match allowed storefront domains.

## Manual verification (for the human)

- Verify that your storefront makes API requests normally from local port `5173`.
