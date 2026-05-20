# API Documentation - News Editor

## Overview

The News Editor API provides endpoints for creating, updating, publishing, and managing news articles with rich HTML content. All endpoints require authentication and include XSS protection, rate limiting, and security headers.

## Base URL

```
/api/news
```

## Authentication

All endpoints require a valid session (authenticated user). Admin-only operations require `ADMIN` or `SUPERADMIN` role.

```
Authorization: Bearer <session_token>
```

## Rate Limiting

The following rate limits apply:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/news/draft` | 30 requests | 1 minute |
| `/api/news/upload-image` | 10 requests | 1 minute |
| `/api/news/create` | 5 requests | 1 minute |
| Other endpoints | 60 requests | 1 minute |

**Response Headers:**
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `Retry-After`: Seconds to wait before retrying (on 429 response)

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common Error Codes

| Code | Error | Description |
|------|-------|-------------|
| 400 | Bad Request | Missing required fields or invalid input |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | User lacks required permissions (admin only) |
| 404 | Not Found | Article not found |
| 409 | Conflict | Duplicate content or slug already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

---

## Endpoints

### 1. Create Article

**`POST /api/news/create`**

Create a new news article (admin only).

#### Request

```json
{
  "title": "Article Title",
  "content": "<p>Article HTML content</p>",
  "excerpt": "Short description",
  "category": "Technology",
  "coverImage": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2"]
}
```

#### Response (201 Created)

```json
{
  "id": "article-uuid",
  "slug": "article-title",
  "title": "Article Title",
  "status": "draft",
  "message": "Article created successfully"
}
```

#### Validation

- `title`: Required, max 200 characters
- `content`: Required, max 1MB (approximately 260,000 words)
- `excerpt`: Optional, defaults to first 160 chars of title
- `category`: Required, non-empty string
- `coverImage`: Optional, URL string
- `tags`: Optional, array of strings

#### Security

- Content is sanitized server-side (XSS protection)
- Admin role required
- Rate limited to 5 creates/minute

#### Example

```bash
curl -X POST http://localhost:3000/api/news/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My News Article",
    "content": "<p>This is the article content</p>",
    "category": "Technology",
    "tags": ["news", "tech"]
  }'
```

---

### 2. Get Article

**`GET /api/news/[id]`**

Retrieve article details (published articles are public, drafts require auth).

#### Response (200 OK)

```json
{
  "id": "article-uuid",
  "title": "Article Title",
  "slug": "article-title",
  "excerpt": "Short description",
  "content": "<p>Article HTML content</p>",
  "contentType": "HTML",
  "draftContent": null,
  "draft": false,
  "published": true,
  "publishedAt": "2026-05-20T10:30:00Z",
  "views": 1250,
  "featured": false,
  "readingTime": 5,
  "likes": 42,
  "createdAt": "2026-05-20T10:00:00Z",
  "updatedAt": "2026-05-20T10:30:00Z",
  "lastEditedAt": "2026-05-20T10:30:00Z",
  "commentCount": 3
}
```

#### Authorization

- **Published articles**: Public access (no auth required)
- **Draft articles**: Admin only

#### Example

```bash
# Get published article (public)
curl http://localhost:3000/api/news/article-uuid

# Get draft article (admin required)
curl http://localhost:3000/api/news/article-uuid \
  -H "Authorization: Bearer <token>"
```

---

### 3. Update Article

**`PUT /api/news/[id]/update`** (Full update)  
**`PATCH /api/news/[id]/update`** (Partial update)

Update article content (admin only).

#### Request (PUT - Full Update)

```json
{
  "title": "Updated Title",
  "content": "<p>Updated content</p>",
  "excerpt": "Updated excerpt",
  "category": "Technology",
  "coverImage": "https://example.com/new-image.jpg",
  "tags": ["tag1", "tag2", "tag3"]
}
```

#### Request (PATCH - Partial Update)

Update only specific fields:

```json
{
  "content": "<p>Updated content</p>",
  "draft": false
}
```

#### Response (200 OK)

```json
{
  "id": "article-uuid",
  "slug": "article-title",
  "title": "Updated Title",
  "status": "draft",
  "lastEditedAt": "2026-05-20T11:00:00Z",
  "message": "Article updated successfully"
}
```

#### Validation

- Content max 1MB
- All provided fields are updated
- `lastEditedAt` timestamp is automatically set

#### Security

- Content is sanitized server-side
- Admin role required
- Rate limited to 60 requests/minute

#### Example

```bash
# Full update (PUT)
curl -X PUT http://localhost:3000/api/news/article-uuid/update \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "<p>Updated content</p>"
  }'

# Partial update (PATCH)
curl -X PATCH http://localhost:3000/api/news/article-uuid/update \
  -H "Content-Type: application/json" \
  -d '{"content": "<p>Only update content</p>"}'
```

---

### 4. Publish Article

**`POST /api/news/[id]/publish`**

Publish a draft article (admin only).

#### Response (200 OK)

```json
{
  "id": "article-uuid",
  "slug": "article-title",
  "title": "Article Title",
  "status": "published",
  "publishedAt": "2026-05-20T11:00:00Z",
  "message": "Article published successfully"
}
```

#### Effects

- Sets `published: true`
- Sets `draft: false`
- Sets `publishedAt` to current timestamp
- Article becomes publicly visible

#### Example

```bash
curl -X POST http://localhost:3000/api/news/article-uuid/publish \
  -H "Authorization: Bearer <token>"
```

---

### 5. Archive/Unpublish Article

**`DELETE /api/news/[id]/publish`**

Archive an article (admin only). Uses soft delete.

#### Response (200 OK)

```json
{
  "id": "article-uuid",
  "message": "Article archived successfully"
}
```

#### Effects

- Sets `published: false`
- Sets `draft: true`
- Article is hidden from public but data is preserved

#### Example

```bash
curl -X DELETE http://localhost:3000/api/news/article-uuid/publish \
  -H "Authorization: Bearer <token>"
```

---

### 6. Save Draft

**`POST /api/news/draft`**

Save article draft with auto-save support (admin only).

#### Request

```json
{
  "articleId": "article-uuid-or-null",
  "title": "Draft Title",
  "content": "<p>Draft content</p>",
  "excerpt": "Draft excerpt"
}
```

#### Response (200 OK)

```json
{
  "id": "article-uuid",
  "savedAt": "2026-05-20T10:45:00Z",
  "status": "draft"
}
```

#### Auto-Save Behavior

- Called every 30 seconds while editing
- Called on blur event
- Called before page unload
- Creates new article if `articleId` is null
- Updates existing article if `articleId` is provided

#### Rate Limit

30 draft saves per minute (to prevent abuse)

#### Example

```bash
curl -X POST http://localhost:3000/api/news/draft \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "article-uuid",
    "title": "Work in Progress",
    "content": "<p>Saving my work...</p>"
  }'
```

---

### 7. Get Draft

**`GET /api/news/draft/[id]`**

Retrieve draft details (admin only).

#### Response (200 OK)

```json
{
  "id": "article-uuid",
  "title": "Draft Title",
  "content": "<p>Draft content</p>",
  "excerpt": "Draft excerpt",
  "lastEditedAt": "2026-05-20T10:45:00Z",
  "status": "draft"
}
```

#### Example

```bash
curl http://localhost:3000/api/news/draft/article-uuid \
  -H "Authorization: Bearer <token>"
```

---

### 8. Delete Draft

**`DELETE /api/news/draft/[id]`**

Delete a draft article (admin only).

#### Response (200 OK)

```json
{
  "message": "Draft deleted successfully"
}
```

#### Example

```bash
curl -X DELETE http://localhost:3000/api/news/draft/article-uuid \
  -H "Authorization: Bearer <token>"
```

---

### 9. Upload Image

**`POST /api/news/upload-image`**

Upload image for article (admin only).

#### Request

Multipart form data:

```
Content-Type: multipart/form-data

file: <image-file>
```

#### Response (200 OK)

```json
{
  "url": "https://example.com/uploads/articles/image-1234567890.jpg",
  "filename": "image-1234567890.jpg",
  "size": 102400
}
```

#### Validation

- Supported formats: JPEG, PNG, WebP, GIF
- Max file size: 5MB
- File stored in `/public/uploads/articles/`

#### Rate Limit

10 uploads per minute

#### Example

```bash
curl -X POST http://localhost:3000/api/news/upload-image \
  -H "Authorization: Bearer <token>" \
  -F "file=@image.jpg"
```

---

## Security Features

### 1. Content Sanitization

All HTML content is sanitized server-side using a whitelist approach:

**Allowed tags:** `p`, `h1-h3`, `blockquote`, `ul`, `ol`, `li`, `pre`, `hr`, `strong`, `em`, `u`, `s`, `a`, `code`, `img`, `br`

**Blocked elements:**
- Script tags and inline scripts
- Event handlers (onclick, onerror, etc.)
- iframes
- Dangerous protocols (javascript:, data:, vbscript:)

### 2. Authentication & Authorization

- All write operations require admin role
- Draft articles require authentication to view
- Session validated on every request

### 3. Rate Limiting

Prevents abuse and DoS attacks:
- IP-based rate limiting
- Different limits for different endpoints
- Graceful degradation with 429 status

### 4. Security Headers

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy` for additional XSS protection

### 5. Input Validation

- Content length validation (max 1MB)
- File type validation for images
- URL validation for links
- Required field validation

---

## Best Practices

### 1. Error Handling

Always check response status and handle errors:

```javascript
try {
  const response = await fetch('/api/news/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(articleData)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.error);
  } else {
    const data = await response.json();
    console.log('Success:', data);
  }
} catch (error) {
  console.error('Request failed:', error);
}
```

### 2. Rate Limit Handling

Implement retry logic for 429 responses:

```javascript
async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      continue;
    }
    
    return response;
  }
}
```

### 3. Auto-Save Implementation

Implement auto-save with debouncing:

```javascript
const autoSave = debounce(async (articleData) => {
  const response = await fetch('/api/news/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(articleData)
  });
  
  if (response.ok) {
    console.log('Draft saved');
  }
}, 30000); // 30 seconds
```

---

## Troubleshooting

### 429 Too Many Requests

**Solution:** Wait for the time specified in `Retry-After` header before retrying.

### 401 Unauthorized

**Solution:** Ensure you have a valid session. Log in and try again.

### 403 Forbidden

**Solution:** This operation requires admin privileges. Contact your administrator.

### 400 Bad Request

**Solution:** Check that all required fields are provided and valid. See validation section for each endpoint.

### Content Size Limit Exceeded

**Solution:** Reduce content size or split into multiple articles. Max size is 1MB (approximately 260,000 words).

---

## Examples

### Complete Create-Edit-Publish Workflow

```javascript
// 1. Create new draft
const createResponse = await fetch('/api/news/create', {
  method: 'POST',
  body: JSON.stringify({
    title: 'My Article',
    content: '<p>Initial content</p>',
    category: 'Technology'
  })
});
const { id } = await createResponse.json();

// 2. Auto-save draft as user edits
const autoSave = () => {
  fetch('/api/news/draft', {
    method: 'POST',
    body: JSON.stringify({
      articleId: id,
      title: editor.getTitle(),
      content: editor.getContent()
    })
  });
};

// 3. Publish when ready
const publishResponse = await fetch(`/api/news/${id}/publish`, {
  method: 'POST'
});

// 4. View published article
const viewResponse = await fetch(`/api/news/${id}`);
const article = await viewResponse.json();
```

