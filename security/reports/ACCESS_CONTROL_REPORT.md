# Access Control Security Report

## Status: PASS

## Findings

Ownership checks are implemented in all resource controllers:

### UserController
- `show()`, `update()`, `destroy()`: Checks `$currUser->role !== 'admin' && $user->id !== $currUser->id` → 403 Forbidden.
- Admin users can access any user's data (allows support/admin functions).

### OrderController
- `index()`: Non-admin users see only their own orders (`$query->where('user_id', $user->id)`).
- `show()`, `update()`, `destroy()`: Checks `$currUser->role !== 'admin' && $order->user_id !== $currUser->id` → 403 Forbidden.
- Admin admins can filter by user_id via query param.

### Auth and ownership are separate checks
- Authentication (auth:sanctum) verifies identity.
- Ownership (user_id comparison) verifies authorization.
- Failing ownership returns 403 (distinct from 401 for auth failure).

## What's at risk

Without ownership checks, users could access/modify other users' data. Currently mitigated.

## What's already secure

- All resource ID routes have ownership checks.
- Separate 401 (unauth) and 403 (forbidden) responses.
- Admin bypass for legitimate support needs.

## Recommendations

No further changes required.
