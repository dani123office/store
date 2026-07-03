# Access Control Fix Plan

## Changes

- `backend/app/Http/Controllers/Api/UserController.php` — Enforce ownership checks on user detail read/update/delete.
- `backend/app/Http/Controllers/Api/OrderController.php` — Enforce scoping on index list and ownership checks on details.

## New files

None.

## Verification goals

After implementation, ALL of these must be true:

- [x] Requesting `GET /api/users/{other_id}` with user A token returns 403.
- [x] Requesting `PUT /api/users/{other_id}` with user A token returns 403.
- [x] Requesting `GET /api/orders/{other_order_id}` with user A token returns 403.
- [x] Requesting `GET /api/orders` with user A token only returns user A's orders.

## Manual verification (for the human)

- Log in as user A, fetch your orders, and verify you only see your orders.
- Attempt to directly query a known user B profile ID using Postman/curl with user A's token, and verify it returns a 403 Forbidden.
