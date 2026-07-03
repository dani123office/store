# Secrets Exposure Fix Plan

## Changes

- `.gitignore` — Added `.env` to root `.gitignore`.
- `backend/.gitignore` — Added `.env` to Laravel `.gitignore`.
- `backend/.env` — Untracked from Git repository using `git rm --cached`.

## New files

None.

## Verification goals

After implementation, ALL of these must be true:

- [x] `git ls-files backend/.env` returns empty/nothing.
- [x] Root `.gitignore` contains `.env`.
- [x] `backend/.gitignore` contains `.env`.
- [x] No `VITE_*`, `NEXT_PUBLIC_*`, `REACT_APP_*` vars contain secrets.
- [x] `.env.example` has placeholder values only.

## Manual verification (for the human)

- **Rotate APP_KEY**: Run `php artisan key:generate` in production to invalidate the exposed key from git history.
- **Consider git history scrub**: If the repo is public or shared, use BFG Repo-Cleaner to remove `backend/.env` from all commits.
- Verify that your local `backend/.env` file still exists on disk (should not be deleted).
