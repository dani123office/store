# Error Handling Fix Plan

## Changes

- `backend/routes/api.php` — Replaced all `$e->getMessage()` in catch blocks with generic error messages. Added `Log::error()` calls to log actual error details server-side. Added `use Illuminate\Support\Facades\Log` import.
- `backend/app/Http/Controllers/Api/UserController.php` — Fixed `index()` to hide password hashes via `->makeHidden(['password'])`.

## New files

None.

## Verification goals

- [x] No API response exposes stack traces, SQL errors, file paths, or library names.
- [x] All catch blocks in routes/api.php return generic messages.
- [x] Error details logged server-side via `Log::error()`.
- [x] User list endpoint hides password hashes.

## Manual verification (for the human)

- Set `APP_DEBUG=false` in production `.env`.
- Trigger an error in an API endpoint and verify the response contains a generic message, not a stack trace.
