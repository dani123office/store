# Authentication Middleware Fix Plan

## Changes

- `backend/routes/api.php` — Restructure routes into public, authenticated user, and admin-only groups.
- `backend/app/Http/Controllers/Api/AuthController.php` — Issue tokens on login and register.
- `src/axios/custom.ts` — Add request interceptor to automatically attach authorization tokens.
- `src/pages/Login.tsx` — Store token in localStorage upon successful authentication.
- `src/pages/Register.tsx` — Store token in localStorage upon successful registration.

## New files

- `backend/app/Http/Middleware/AdminMiddleware.php` — Class created to filter requests and ensure user has the admin role.

## Verification goals

After implementation, ALL of these must be true:

- [x] `GET /api/users` without token returns 401.
- [x] `POST /api/products` without token returns 401.
- [x] `POST /api/products` with non-admin user token returns 403.
- [x] Axios calls from React frontend automatically carry the `Authorization: Bearer <token>` header.

## Manual verification (for the human)

- Register a new user, log in, and verify that the user profile operates normally and fetches profile details.
- Attempt to navigate to the admin dashboard and confirm that non-admin accounts are blocked.
