# سیستم مدیریت ویدیو - راهنمای نصب و استفاده

## 📋 فهرست مطالب

1. [معرفی](#معرفی)
2. [ویژگی‌ها](#ویژگی‌ها)
3. [معماری سیستم](#معماری-سیستم)
4. [نصب و پیکربندی](#نصب-و-پیکربندی)
5. [استفاده](#استفاده)
6. [API Documentation](#api-documentation)
7. [امنیت](#امنیت)
8. [عیب‌یابی](#عیب‌یابی)

---

## معرفی

سیستم مدیریت ویدیوی جامع برای پلتفرم آموزشی که شامل:

- آپلود امن ویدیو از CMS
- تبدیل خودکار به HLS (Adaptive Bitrate Streaming)
- پخش امن با سیستم توکن‌گذاری چند لایه
- جلوگیری از دانلود مستقیم با IDM و download managers

---

## ویژگی‌ها

### ✨ ویژگی‌های اصلی

1. **آپلود امن:**

   - Signed Upload URL با اعتبار محدود
   - آپلود مستقیم از مرورگر به Object Storage
   - پشتیبانی از فایل‌های تا 5GB

2. **تبدیل خودکار به HLS:**

   - پشتیبانی از چند کیفیت (360p, 720p, 1080p)
   - تولید خودکار thumbnail
   - Segment duration قابل تنظیم

3. **امنیت پخش:**

   - توکن‌های کوتاه‌مدت (30 ثانیه)
   - Signed URLs برای فایل‌های HLS
   - اعتبارسنجی دسترسی کاربر به دوره

4. **مدیریت جامع:**
   - CRUD کامل برای ویدیوها
   - ردیابی وضعیت پردازش
   - نمایش progress در CMS

---

## معماری سیستم

```
┌─────────────┐
│   مرورگر    │
│   مدیر CMS  │
└──────┬──────┘
       │
       │ 1. درخواست Upload URL
       ▼
┌─────────────────────────┐
│   Next.js Backend       │
│   /api/admin/videos/    │
│   upload-url            │
└──────┬──────────────────┘
       │
       │ 2. تولید Signed URL
       ▼
┌─────────────────────────┐
│   Object Storage        │
│   (S3-compatible)       │
└──────┬──────────────────┘
       │
       │ 3. آپلود مستقیم فایل
       ▼
┌─────────────────────────┐
│   FFmpeg Worker         │
│   تبدیل به HLS          │
└──────┬──────────────────┘
       │
       │ 4. ذخیره HLS files
       ▼
┌─────────────────────────┐
│   Database (MongoDB)    │
│   ذخیره metadata        │
└─────────────────────────┘

┌─────────────┐
│   کاربر     │
│   پخش ویدیو │
└──────┬──────┘
       │
       │ 1. درخواست توکن
       ▼
┌─────────────────────────┐
│   /api/video/token      │
│   بررسی دسترسی         │
│   تولید توکن 30 ثانیه  │
└──────┬──────────────────┘
       │
       │ 2. توکن
       ▼
┌─────────────────────────┐
│   HLS.js Player         │
│   درخواست playlist      │
└──────┬──────────────────┘
       │
       │ 3. /api/video/stream/[id]/index.m3u8?token=xxx
       ▼
┌─────────────────────────┐
│   Stream Proxy API      │
│   اعتبارسنجی توکن      │
│   بازگشت playlist       │
└─────────────────────────┘
```

---

## نصب و پیکربندی

### 1. نصب Dependencies

```bash
# نصب AWS SDK برای Object Storage
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# نصب HLS.js برای پخش ویدیو
npm install hls.js

# نصب تایپ‌ها
npm install -D @types/hls.js
```

### 2. نصب FFmpeg

FFmpeg برای تبدیل ویدیو به HLS ضروری است.

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS:**

```bash
brew install ffmpeg
```

**Docker:**

```dockerfile
FROM node:18-alpine

# نصب FFmpeg
RUN apk add --no-cache ffmpeg

# باقی Dockerfile...
```

**بررسی نصب:**

```bash
ffmpeg -version
ffprobe -version
```

### 3. تنظیمات Environment Variables

فایل `.env` خود را با این متغیرها تکمیل کنید:

```env
# Object Storage (S3-compatible)
S3_REGION=default
S3_ENDPOINT=https://s3.ir-thr-at1.iranServerstorage.ir  # for iranServer Cloud
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name
S3_PUBLIC_ENDPOINT=https://your-bucket.s3.ir-thr-at1.iranServerstorage.ir

# Video Token Secret
VIDEO_TOKEN_SECRET=your-very-strong-secret-key-here-min-32-chars

# Temporary Directory برای پردازش
TEMP_DIR=/tmp/video-processing

# Database
DATABASE_URL=mongodb://...
```

### 4. تنظیمات Object Storage

#### برای iranServer Cloud:

1. وارد پنل iranServer شوید
2. بخش Cloud Storage → ایجاد Bucket جدید
3. دریافت Access Key و Secret Key
4. تنظیم CORS:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

#### برای Liara Object Storage:

```env
S3_ENDPOINT=https://storage.iran.liara.space
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-liara-access-key
S3_SECRET_ACCESS_KEY=your-liara-secret-key
S3_BUCKET_NAME=your-bucket-name
```

### 5. اجرای Migration

```bash
# اضافه کردن مدل Video به دیتابیس
npx prisma generate
npx prisma db push
```

### 6. تنظیمات Production

برای محیط production، باید یک worker جداگانه برای پردازش ویدیوها داشته باشید:

**Option 1: Cron Job**

```bash
# اضافه کردن به crontab
*/5 * * * * node /path/to/video-processor-worker.js
```

**Option 2: Queue System (پیشنهادی)**

```bash
npm install bull redis
```

---

## استفاده

### 1. آپلود ویدیو از CMS

```tsx
import { VideoUploader } from "@/components/admin/videoUploader";

export default function AdminPage() {
  return (
    <VideoUploader
      onUploadComplete={(video) => {
        console.log("ویدیو آپلود شد:", video);
        // Redirect یا نمایش پیام موفقیت
      }}
      onError={(error) => {
        console.error("خطا:", error);
      }}
    />
  );
}
```

### 2. پخش ویدیو برای کاربر

```tsx
import { VideoPlayer } from "@/components/video/videoPlayer";

export default function LessonPage({ videoId }: { videoId: string }) {
  return (
    <VideoPlayer
      videoId={videoId}
      autoPlay={false}
      controls={true}
      poster="/thumbnail.jpg"
      className="w-full aspect-video"
      onReady={() => console.log("ویدیو آماده است")}
      onError={(error) => console.error("خطا:", error)}
    />
  );
}
```

### 3. استفاده از Hooks

```tsx
import { useVideos, useVideo, useDeleteVideo } from "@/lib/hooks/useVideos";

function VideoManagement() {
  // دریافت لیست ویدیوها
  const { data: videosData, isLoading } = useVideos({
    page: 1,
    limit: 20,
    processingStatus: "READY",
  });

  // دریافت یک ویدیو
  const { data: video } = useVideo("video-id");

  // حذف ویدیو
  const deleteMutation = useDeleteVideo();

  const handleDelete = (videoId: string) => {
    deleteMutation.mutate(videoId);
  };

  // ...
}
```

---

## API Documentation

### 1. دریافت Upload URL

**Endpoint:** `POST /api/admin/videos/upload-url`

**Authentication:** Admin only

**Request Body:**

```json
{
  "fileName": "my-video.mp4",
  "fileSize": 104857600,
  "fileFormat": "mp4",
  "title": "عنوان ویدیو",
  "description": "توضیحات اختیاری"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "uploadUrl": "https://...",
    "videoId": "abc123...",
    "storagePath": "videos/abc123/...",
    "expiresAt": 1234567890
  }
}
```

### 2. ایجاد ویدیو

**Endpoint:** `POST /api/admin/videos`

**Request Body:**

```json
{
  "title": "عنوان ویدیو",
  "description": "توضیحات",
  "videoId": "abc123",
  "originalPath": "videos/abc123/file.mp4",
  "fileSize": 104857600,
  "fileFormat": "mp4",
  "startProcessing": true
}
```

### 3. دریافت توکن پخش

**Endpoint:** `POST /api/video/token`

**Authentication:** User must be logged in

**Request Body:**

```json
{
  "videoId": "abc123"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "token": "eyJ...",
    "videoId": "abc123",
    "expiresAt": 1234567890
  }
}
```

### 4. پخش ویدیو

**Endpoint:** `GET /api/video/stream/[videoId]/index.m3u8?token=xxx`

**Headers:**

- `Range`: برای byte-range requests

**Response:**

- `Content-Type: application/vnd.apple.mpegurl`
- Body: محتوای m3u8 با URLهای modify شده

---

## امنیت

### سطح 1: Signed Upload URLs

- تولید URL با اعتبار 1 ساعته
- فقط ادمین می‌تواند درخواست دهد
- هر URL فقط یک بار قابل استفاده

### سطح 2: Token Verification

- قبل از پخش، توکن 30 ثانیه‌ای دریافت شود
- توکن شامل userId و videoId است
- HMAC SHA256 برای امضای توکن

### سطح 3: Stream Proxy

- هر درخواست playlist و segment باید توکن داشته باشد
- توکن در server اعتبارسنجی می‌شود
- فایل‌ها از storage خوانده و proxy می‌شوند

### سطح 4: Access Control

- بررسی اینکه کاربر در دوره ثبت‌نام کرده باشد
- فقط کاربران authorized می‌توانند ویدیو ببینند

---

## عیب‌یابی

### خطای "FFmpeg not found"

**راه‌حل:**

```bash
# بررسی نصب
which ffmpeg
which ffprobe

# اگر نصب نیست:
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg
```

### خطای "توکن منقضی شده"

**علت:** Player خیلی دیر درخواست segment را فرستاده

**راه‌حل:**

- در `video-token-service.ts` مدت اعتبار را افزایش دهید:

```ts
const DEFAULT_TOKEN_EXPIRY = 60; // از 30 به 60 ثانیه
```

### خطای "Access Denied" در Object Storage

**راه‌حل:**

1. بررسی Access Key و Secret Key
2. بررسی CORS settings در bucket
3. بررسی Bucket Policy

### ویدیو در Safari پخش نمی‌شود

**علت:** Safari نیاز به HTTPS برای HLS دارد

**راه‌حل:**

- از HTTPS در production استفاده کنید
- برای development از `ngrok` یا `localtunnel` استفاده کنید

### پردازش ویدیو خیلی طول می‌کشد

**راه‌حل:**

1. کیفیت‌های کمتری را فعال کنید (فقط 360p و 720p)
2. `segmentDuration` را افزایش دهید (از 6 به 10 ثانیه)
3. از server قوی‌تر استفاده کنید
4. پردازش را به worker جداگانه منتقل کنید

---

## مثال کامل استفاده

### صفحه مدیریت ویدیوها

```tsx
"use client";

import { useState } from "react";
import { VideoUploader } from "@/components/admin/videoUploader";
import { useVideos, useDeleteVideo } from "@/lib/hooks/useVideos";

export default function VideosManagementPage() {
  const [page, setPage] = useState(1);
  const { data: videosData, isLoading } = useVideos({ page, limit: 10 });
  const deleteMutation = useDeleteVideo();

  const getStatusBadge = (status: string) => {
    const badges = {
      UPLOADING: "آپلود در حال انجام",
      UPLOADED: "آپلود شده",
      PROCESSING: "در حال پردازش",
      READY: "آماده",
      FAILED: "خطا",
    };
    return badges[status as keyof typeof badges] || status;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">مدیریت ویدیوها</h1>

      {/* آپلود ویدیوی جدید */}
      <div className="mb-8">
        <VideoUploader
          onUploadComplete={(video) => {
            alert(`ویدیو "${video.title}" با موفقیت آپلود شد!`);
          }}
        />
      </div>

      {/* لیست ویدیوها */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-right">عنوان</th>
              <th className="p-4 text-right">وضعیت</th>
              <th className="p-4 text-right">تاریخ ایجاد</th>
              <th className="p-4 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {videosData?.items.map((video) => (
              <tr key={video.id} className="border-b">
                <td className="p-4">{video.title}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-100 rounded">
                    {getStatusBadge(video.processingStatus)}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(video.createdAt).toLocaleDateString("fa-IR")}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => deleteMutation.mutate(video.videoId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## پشتیبانی

برای سوالات و مشکلات:

- GitHub Issues: [لینک به repository]
- Email: support@example.com

---

تهیه شده با ❤️ برای پلتفرم آموزشی پیشرو
