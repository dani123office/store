# File Uploads Security Report

## Status: PASS

## Findings

Audited `UploadController` and `MediaController`:

1. **UploadController**:
   - ✅ MIME type validation via Laravel `image|mimes:jpg,jpeg,png,gif,webp` — uses PHP finfo (magic bytes), not just extension.
   - ✅ Size limit: `max:3072` (3MB) enforced server-side.
   - ❌ Old naming: `time() . '_' . sanitized_original_name` — predictable filenames.
   - ❌ Stored in `public/assets/` (web-accessible), not a separate domain.
   - **FIX**: Changed to UUID-based filenames using `Str::uuid()`.

2. **MediaController::destroy**:
   - ✅ System asset protection prevents deletion of core assets.
   - ❌ Path traversal risk — filename from URL with `->where('filename', '.*')` allowing arbitrary characters.
   - **FIX**: Added `basename()` sanitization and regex validation (`/^[a-zA-Z0-9._-]+$/`).

## What's at risk

Predictable filenames allow enumeration of uploaded files. Path traversal in MediaController could allow deleting files outside the assets directory. Both fixed.

## What's already secure

- Magic byte validation for image uploads.
- Server-side size limits enforced.
- System asset protection prevents deletion of critical files.
- File types restricted to safe image formats.

## Recommendations

- **Separate storage**: For production, move uploads to a separate domain/bucket (S3, R2, GCS) to prevent direct file access and XSS via uploaded files.
- **Consider using Laravel's filesystem** with `Storage::disk('s3')` for production deployments.
