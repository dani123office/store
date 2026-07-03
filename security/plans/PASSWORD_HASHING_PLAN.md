# Password Hashing Fix Plan

## Changes

None — bcrypt with 12 rounds is already in use throughout the authentication system.

## New files

None.

## Verification goals

- [x] Passwords hashed with bcrypt (Laravel default).
- [x] No MD5, SHA-1, or SHA-256 used for passwords.
- [x] BCRYPT_ROUNDS=12 in environment configuration.

## Manual verification (for the human)

- Check that `config/hashing.php` uses `bcrypt` as the default driver.
- Verify newly registered users' password hashes start with `$2y$` (bcrypt prefix).
- Consider upgrading to Argon2id for enhanced security.
