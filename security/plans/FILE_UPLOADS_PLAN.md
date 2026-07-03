# File Uploads Fix Plan

## Changes

- `backend/app/Http/Controllers/Api/UploadController.php` — Changed filename generation from `time()_...` to `Str::uuid()` for unpredictable filenames.
- `backend/app/Http/Controllers/Api/MediaController.php` — Added `basename()` sanitization and regex filename validation to prevent path traversal in the destroy endpoint.

## New files

None.

## Verification goals

- [x] Uploaded files get UUID-based filenames (not predictable).
- [x] File type validated by Laravel's `image|mimes` rule (uses magic bytes via PHP finfo).
- [x] File size limited to 3MB server-side.
- [x] MediaController::destroy sanitizes filename and rejects invalid characters.

## Manual verification (for the human)

- Upload an image and verify the filename in `/backend/public/assets/` is a UUID.
- Try deleting a file with path traversal characters (`../../etc/passwd`) and verify it returns 400.
- Upload a non-image file (e.g. `.txt`) and verify it's rejected.
