# Admin Book File Uploads

This document describes the new admin API endpoints to upload book-related files (cover image, book file, audiobook).

## Endpoints

- POST /api/admin/uploads/books
  - Content-Type: multipart/form-data
  - Fields:
    - file: file content (required)
    - type: one of `image`, `file`, `audio` (defaults to `file`)
    - fileName: optional desired filename (without path)
  - Response: { url, relativePath, fileName, size, mimeType }

- POST /api/admin/uploads/books/rename
  - Content-Type: application/json
  - Body: { url: string, newFileName: string }
  - Purpose: Rename/move an already uploaded file (used for editing filename in UI before final save)

## Storage
Files are stored under `${UPLOAD_STORAGE_PATH}/books/{images|files|audios}` and served from `${UPLOAD_BASE_URL}/books/...`.

## Permissions
Make sure the server has the following directories and permissions:

```bash
sudo mkdir -p /var/www/uploads/books/images /var/www/uploads/books/files /var/www/uploads/books/audio
sudo chown -R www-data:www-data /var/www/uploads
sudo chmod -R 755 /var/www/uploads
```

## Frontend
The admin Book form supports uploading files and editing filenames before saving the book. The upload occurs immediately and returns a `url` which is stored in the form; editing the filename triggers the `rename` endpoint to move the file on the server and update the URL.
