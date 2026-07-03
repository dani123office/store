# Dependencies Fix Plan

## Changes

- `package.json` — Pinned all dependency versions to exact values (removed `^` prefixes). Moved `json-server` from `dependencies` to `devDependencies`.

## New files

None.

## Verification goals

- [x] All production dependency versions pinned exactly (no `^` or `~`).
- [x] `json-server` moved to devDependencies.
- [x] `package-lock.json` committed.

## Manual verification (for the human)

- Run `npm audit` to check for known vulnerabilities.
- Run `cd backend && composer audit` to check PHP dependencies.
- Consider enabling Dependabot for automated security updates.
