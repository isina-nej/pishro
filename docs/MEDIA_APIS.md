# Media APIs Documentation

راهنمای کامل APIهای مدیریت تصاویر و ویدیوها برای ادمین

---

## 🖼️ Images APIs

### 1. لیست تصاویر با فیلتر و صفحه‌بندی
```http
GET /api/admin/images
```

**Query Parameters:**
- `page` (number, default: 1) - شماره صفحه
- `limit` (number, default: 20, max: 100) - تعداد در هر صفحه
- `search` (string, optional) - جستجو در عنوان/توضیحات
- `category` (ImageCategory, optional) - فیلتر بر اساس دسته‌بندی

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

---

### 2. آپلود تصویر جدید
```http
POST /api/admin/images
Content-Type: multipart/form-data
```

**Body (FormData):**
- `file` (File, required) - فایل تصویر
- `category` (ImageCategory, optional, default: OTHER)
- `title` (string, optional)
- `description` (string, optional)
- `alt` (string, optional)
- `tags` (string, optional) - جدا شده با کاما

**Response:**
```json
{
  "success": true,
  "message": "تصویر با موفقیت آپلود شد",
  "data": {
    "id": "...",
    "fileName": "...",
    "filePath": "...",
    "fileSize": 123456,
    "mimeType": "image/jpeg",
    "category": "COURSE"
  }
}
```

---

### 3. دریافت اطلاعات یک تصویر
```http
GET /api/admin/images/[id]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "...",
    "description": "...",
    "alt": "...",
    "fileName": "...",
    "filePath": "...",
    "fileSize": 123456,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080,
    "category": "COURSE",
    "tags": ["tag1", "tag2"],
    "published": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 4. به‌روزرسانی متادیتای تصویر
```http
PATCH /api/admin/images/[id]
Content-Type: application/json
```

**Body:**
```json
{
  "title": "عنوان جدید",
  "description": "توضیحات جدید",
  "alt": "متن جایگزین",
  "tags": ["tag1", "tag2"],
  "category": "COURSE",
  "published": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "تصویر با موفقیت به‌روزرسانی شد",
  "data": { ... }
}
```

---

### 5. حذف تصویر
```http
DELETE /api/admin/images/[id]
```

**Response:**
```json
{
  "success": true,
  "message": "تصویر با موفقیت حذف شد",
  "data": { "deleted": true }
}
```

---

### 6. آمار تصاویر
```http
GET /api/admin/images/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byCategory": {
      "COURSE": 50,
      "BOOK": 30,
      "NEWS": 20,
      ...
    },
    "published": 140,
    "unpublished": 10,
    "totalSize": 52428800
  }
}
```

---

## 🎬 Videos APIs

### 1. دریافت URL آپلود (Signed Upload URL)
```http
POST /api/admin/videos/upload-url
Content-Type: application/json
```

**Body:**
```json
{
  "fileName": "video.mp4",
  "fileSize": 104857600,
  "fileFormat": "mp4",
  "title": "عنوان ویدیو",
  "description": "توضیحات"
}
```

**Validation:**
- فرمت‌های مجاز: `mp4`, `mov`, `avi`, `mkv`, `webm`
- حداکثر حجم: 5GB

**Response:**
```json
{
  "success": true,
  "message": "URL آپلود با موفقیت ایجاد شد",
  "data": {
    "uploadUrl": "https://...",
    "videoId": "vid_abc123",
    "storagePath": "videos/vid_abc123/...",
    "uniqueFileName": "...",
    "expiresAt": 1234567890000,
    "metadata": {
      "title": "...",
      "description": "...",
      "fileSize": 104857600,
      "fileFormat": "mp4"
    }
  }
}
```

**نحوه استفاده:**
1. دریافت `uploadUrl` از این API
2. آپلود مستقیم فایل به object storage با `PUT uploadUrl`
3. فراخوانی API ایجاد ویدیو با `videoId`

---

### 2. ایجاد رکورد ویدیو + شروع پردازش HLS
```http
POST /api/admin/videos
Content-Type: application/json
```

**Body:**
```json
{
  "title": "عنوان ویدیو",
  "description": "توضیحات",
  "videoId": "vid_abc123",
  "originalPath": "videos/vid_abc123/video.mp4",
  "fileSize": 104857600,
  "fileFormat": "mp4",
  "duration": "45:30",
  "width": 1920,
  "height": 1080,
  "bitrate": 5000000,
  "codec": "h264",
  "frameRate": 30,
  "startProcessing": true
}
```

**Required Fields:**
- `title`, `videoId`, `originalPath`, `fileSize`, `fileFormat`

**Response:**
```json
{
  "success": true,
  "message": "ویدیو با موفقیت ایجاد شد و پردازش آن شروع شد",
  "data": {
    "id": "...",
    "videoId": "vid_abc123",
    "title": "...",
    "processingStatus": "UPLOADED",
    ...
  }
}
```

**نکته:** پردازش HLS به صورت background انجام می‌شود

---

### 3. لیست ویدیوها با فیلتر و صفحه‌بندی
```http
GET /api/admin/videos
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string, optional) - جستجو در عنوان/توضیحات
- `status` (VideoProcessingStatus, optional)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

---

### 4. دریافت اطلاعات یک ویدیو
```http
GET /api/admin/videos/[videoId]
```

**Response:**
```json
{
  "success": true,
  "message": "ویدیو با موفقیت دریافت شد",
  "data": {
    "id": "...",
    "videoId": "vid_abc123",
    "title": "...",
    "description": "...",
    "originalPath": "...",
    "fileSize": 104857600,
    "fileFormat": "mp4",
    "duration": "45:30",
    "hlsPlaylistPath": "...",
    "hlsSegmentsPath": "...",
    "processingStatus": "READY",
    "processingError": null,
    "thumbnailPath": "...",
    "width": 1920,
    "height": 1080,
    "bitrate": 5000000,
    "codec": "h264",
    "frameRate": 30,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 5. به‌روزرسانی ویدیو
```http
PUT /api/admin/videos/[videoId]
Content-Type: application/json
```

**Body:**
```json
{
  "title": "عنوان جدید",
  "description": "توضیحات جدید",
  "duration": "50:00",
  "hlsPlaylistPath": "...",
  "hlsSegmentsPath": "...",
  "processingStatus": "READY",
  "processingError": null,
  "thumbnailPath": "...",
  "width": 1920,
  "height": 1080,
  "bitrate": 5000000,
  "codec": "h264",
  "frameRate": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "ویدیو با موفقیت بروزرسانی شد",
  "data": { ... }
}
```

---

### 6. حذف ویدیو
```http
DELETE /api/admin/videos/[videoId]
```

**Response:**
```json
{
  "success": true,
  "message": "ویدیو با موفقیت حذف شد",
  "data": { "videoId": "vid_abc123" }
}
```

**نکته:** فایل‌های ذخیره شده در storage نیز حذف می‌شوند

---

### 7. آمار ویدیوها
```http
GET /api/admin/videos/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "byStatus": {
      "UPLOADING": 2,
      "UPLOADED": 3,
      "PROCESSING": 5,
      "READY": 38,
      "FAILED": 2
    },
    "totalSize": 5368709120,
    "totalDuration": "2500:30:00"
  }
}
```

---

### 8. آپلود ساده ویدیو (روش قدیمی)
```http
POST /api/admin/upload-video
Content-Type: multipart/form-data
```

**Body (FormData):**
- `video` (File, required)

**Validation:**
- فرمت‌های مجاز: `video/mp4`, `video/quicktime`, `video/x-msvideo`, `video/x-matroska`, `video/webm`
- حداکثر حجم: 256MB
- فایل در `public/uploads/videos/` ذخیره می‌شود

**Response:**
```json
{
  "success": true,
  "message": "ویدیو با موفقیت آپلود شد",
  "data": {
    "videoUrl": "/uploads/videos/video_1234567890_abc.mp4",
    "filename": "video_1234567890_abc.mp4",
    "fileSize": 52428800,
    "fileType": "video/mp4"
  }
}
```

**نکته:** این روش برای ویدیوهای کوچک است. برای ویدیوهای بزرگ از روش Signed Upload URL استفاده کنید.

---

## 📊 Enums & Types

### ImageCategory
```typescript
enum ImageCategory {
  PROFILE      // تصویر پروفایل
  COURSE       // تصاویر دوره‌ها
  BOOK         // تصاویر کتاب‌ها
  NEWS         // تصاویر اخبار
  RESUME       // تصاویر رزومه
  CERTIFICATE  // تصاویر گواهینامه
  TEAM         // تصاویر اعضای تیم
  LANDING      // تصاویر صفحات لندینگ
  OTHER        // سایر موارد
}
```

### VideoProcessingStatus
```typescript
enum VideoProcessingStatus {
  UPLOADING   // در حال آپلود
  UPLOADED    // آپلود شده (منتظر پردازش)
  PROCESSING  // در حال تبدیل به HLS
  READY       // آماده برای پخش
  FAILED      // خطا در پردازش
}
```

---

## 🔐 Authentication

**همه APIها نیاز به احراز هویت دارند:**
- Session باید معتبر باشد (`auth()`)
- نقش کاربر باید `ADMIN` باشد
- در غیر این صورت: `401 Unauthorized` یا `403 Forbidden`

---

## 📝 نکات مهم

### تصاویر:
- ✅ فیلد `published` برای کنترل نمایش عمومی/خصوصی
- ✅ تگ‌گذاری برای دسته‌بندی بهتر
- ✅ حذف از storage و database همزمان
- ✅ پشتیبانی از جستجو و فیلتر پیشرفته

### ویدیوها:
- ✅ دو روش آپلود: ساده (کوچک) و Signed URL (بزرگ)
- ✅ پردازش خودکار HLS با کیفیت‌های مختلف
- ✅ تولید thumbnail به صورت خودکار
- ✅ پیگیری وضعیت پردازش (status tracking)
- ✅ حذف امن فایل‌های storage
- ⚠️ پردازش HLS زمان‌بر است (background)

---

## 🚀 فلوی پیشنهادی آپلود ویدیو

1. **Frontend**: درخواست Upload URL
   ```js
   POST /api/admin/videos/upload-url
   ```

2. **Frontend**: آپلود مستقیم به Storage
   ```js
   PUT uploadUrl (with file)
   ```

3. **Frontend**: ایجاد رکورد ویدیو
   ```js
   POST /api/admin/videos (with videoId)
   ```

4. **Backend**: پردازش HLS در background

5. **Frontend**: polling status
   ```js
   GET /api/admin/videos/[videoId]
   // Check processingStatus
   ```

---

این داکیومنت همه چیزی است که AI Agent بک‌اند برای پیاده‌سازی سیستم مدیریت media نیاز دارد. 🎯
