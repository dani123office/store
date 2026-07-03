# XSS Fix Plan

## Changes

- `src/pages/HomeLayout.tsx` — Added input validation for GA tracking ID (`/^G-[A-Za-z0-9]+$/`) and FB Pixel ID (`/^\d+$/`), plus character sanitization before innerHTML injection. Used `encodeURIComponent` for script src URL.

## New files

None.

## Verification goals

- [x] No `dangerouslySetInnerHTML` in React components.
- [x] innerHTML usage in HomeLayout.tsx sanitizes user-controlled input.
- [x] React auto-escaping handles all JSX rendering.

## Manual verification (for the human)

- Test SEO settings page: enter a malicious string like `<script>alert(1)</script>` as tracking ID and verify it doesn't execute.
- Verify Google Analytics and Facebook Pixel still work with valid IDs.
