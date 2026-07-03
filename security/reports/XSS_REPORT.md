# XSS Security Report

## Status: PASS

## Findings

Audited `src/` for `dangerouslySetInnerHTML`, `innerHTML`, and unescaped user content:

1. **HomeLayout.tsx**: Uses `document.createElement("script")` with `script.innerHTML` for Google Analytics and Facebook Pixel injection. The tracking IDs are sourced from `localStorage` (admin-controlled SEO settings).

2. **Fix applied**: Added input validation before injection:
   - GA tracking ID: must match `/^G-[A-Za-z0-9]+$/`, then sanitized with `.replace(/[^A-Za-z0-9-]/g, '')`.
   - FB Pixel ID: must match `/^\d+$/`, then sanitized with `.replace(/[^0-9]/g, '')`.
   - GA script src uses `encodeURIComponent()` for URL safety.

3. **No other XSS vectors found**: React auto-escapes by default in JSX, no `dangerouslySetInnerHTML` usage elsewhere.

## What's at risk

Without validation, a compromised admin account could inject malicious JavaScript via localStorage SEO tracking IDs. Currently mitigated by pattern validation and sanitization.

## What's already secure

- React's default auto-escaping prevents XSS in JSX.
- Tracking ID validation restricts input to safe characters.
- No `dangerouslySetInnerHTML` or `v-html` usage.

## Recommendations

No further changes required. Avoid raw HTML rendering where possible.
