# راهنمای جامع API های آپلود فایل (تصویر و ویدیو)

این مستند راهنمای کامل استفاده از API های آپلود عکس و ویدیو در پنل ادمین را ارائه می‌دهد.

---

## 📑 فهرست مطالب

1. [API های آپلود تصویر](#-api-های-آپلود-تصویر)
2. [API های آپلود ویدیو](#-api-های-آپلود-ویدیو)
3. [دسته‌بندی تصاویر](#-دسته‌بندی-تصاویر)
4. [محدودیت‌ها و قوانین](#-محدودیتها-و-قوانین)
5. [نمونه کد](#-نمونه-کد)

---

## 🖼️ API های آپلود تصویر

### 1️⃣ آپلود تصویر عمومی (ادمین)

**مسیر:** `POST /api/admin/images`

**کاربرد:** آپلود تصاویر با دسته‌بندی مختلف (عکس دوره‌ها، کتاب‌ها، اخبار، تیم، لندینگ و ...)

**احراز هویت:** ✅ لازم است (فقط ادمین)

**نوع درخواست:** `multipart/form-data`

**پارامترها:**

| نام پارامتر | نوع | الزامی | توضیحات |
|------------|-----|--------|---------|
| `file` | File | ✅ | فایل تصویر |
| `category` | String | ✅ | دسته‌بندی تصویر (مقادیر مجاز را در جدول زیر ببینید) |
| `title` | String | ❌ | عنوان تصویر |
| `description` | String | ❌ | توضیحات تصویر |
| `alt` | String | ❌ | متن جایگزین تصویر (برای SEO) |
| `tags` | String | ❌ | برچسب‌ها (با کاما جدا شوند: "tag1,tag2,tag3") |

**محدودیت‌ها:**

- حجم فایل: حداکثر **10MB**
- فرمت‌های مجاز: **JPG, JPEG, PNG, GIF, WEBP, SVG**

**پاسخ موفقیت‌آمیز:**

```json
{
  "success": true,
  "message": "تصویر با موفقیت آپلود شد",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "filePath": "images/course/abc123_1234567890.jpg",
    "fileName": "my-image.jpg",
    "url": "/uploads/images/course/abc123_1234567890.jpg"
  }
}
```

---

### 2️⃣ آپلود آواتار کاربر

**مسیر:** `POST /api/user/upload-avatar`

**کاربرد:** آپلود تصویر پروفایل کاربر

**احراز هویت:** ✅ لازم است (کاربر لاگین شده)

**نوع درخواست:** `multipart/form-data`

**پارامترها:**

| نام پارامتر | نوع | الزامی | توضیحات |
|------------|-----|--------|---------|
| `avatar` | File | ✅ | فایل تصویر آواتار |

**محدودیت‌ها:**

- حجم فایل: حداکثر **2MB**
- فرمت‌های مجاز: **JPG, JPEG, PNG, WEBP**

**پاسخ موفقیت‌آمیز:**

```json
{
  "success": true,
  "message": "تصویر پروفایل با موفقیت آپلود شد",
  "data": {
    "avatarUrl": "/uploads/avatars/user123_1234567890_abc.jpg"
  }
}
```

**توضیحات اضافی:**

- این API به صورت خودکار آواتار کاربر را در دیتابیس به‌روزرسانی می‌کند
- فایل در مسیر `public/uploads/avatars/` ذخیره می‌شود
- نام فایل شامل `userId + timestamp + randomString` است

---

### 3️⃣ دریافت لیست تصاویر (ادمین)

**مسیر:** `GET /api/admin/images`

**کاربرد:** مشاهده تمام تصاویر آپلود شده با امکان فیلتر و pagination

**احراز هویت:** ✅ لازم است (فقط ادمین)

**پارامترهای Query:**

| نام پارامتر | نوع | الزامی | پیش‌فرض | توضیحات |
|------------|-----|--------|---------|---------|
| `page` | Number | ❌ | 1 | شماره صفحه |
| `limit` | Number | ❌ | 20 | تعداد آیتم‌ها در هر صفحه (حداکثر 100) |
| `search` | String | ❌ | - | جستجو در عنوان، توضیحات و نام فایل |
| `category` | String | ❌ | - | فیلتر بر اساس دسته‌بندی |

**مثال درخواست:**

```
GET /api/admin/images?page=1&limit=20&category=COURSE&search=آموزش
```

**پاسخ موفقیت‌آمیز:**

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "عکس دوره React",
      "description": "تصویر کاور دوره آموزش React",
      "alt": "دوره React",
      "fileName": "react-course.jpg",
      "filePath": "images/course/abc123_1234567890.jpg",
      "fileSize": 245680,
      "mimeType": "image/jpeg",
      "width": 1920,
      "height": 1080,
      "category": "COURSE",
      "tags": ["react", "frontend"],
      "published": true,
      "url": "/uploads/images/course/abc123_1234567890.jpg",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## 🎬 API های آپلود ویدیو

### 1️⃣ آپلود مستقیم ویدیو (حداکثر 256MB)

**مسیر:** `POST /api/admin/upload-video`

**کاربرد:** آپلود مستقیم ویدیوهای کوچک و متوسط (برای ویدیوهای توضیحات، معرفی و ...)

**احراز هویت:** ✅ لازم است (فقط ادمین)

**نوع درخواست:** `multipart/form-data`

**پارامترها:**

| نام پارامتر | نوع | الزامی | توضیحات |
|------------|-----|--------|---------|
| `video` | File | ✅ | فایل ویدیو |

**محدودیت‌ها:**

- حجم فایل: حداکثر **256MB**
- فرمت‌های مجاز: **MP4, MOV, AVI, MKV, WEBM**

**پاسخ موفقیت‌آمیز:**

```json
{
  "success": true,
  "message": "ویدیو با موفقیت آپلود شد",
  "data": {
    "videoUrl": "/uploads/videos/video_1234567890_abc123.mp4",
    "filename": "video_1234567890_abc123.mp4",
    "fileSize": 52428800,
    "fileType": "video/mp4"
  }
}
```

**توضیحات اضافی:**

- این API برای ویدیوهای عمومی و قابل دانلود مناسب است
- فایل در مسیر `public/uploads/videos/` ذخیره می‌شود
- قابل استفاده برای: ویدیوهای معرفی، ویدیوهای توضیحات کوتاه، تریلر دوره‌ها

⚠️ **توجه:** این API برای ویدیوهای دوره‌های آموزشی (که نیاز به محافظت دارند) مناسب **نیست**.

---

### 2️⃣ دریافت URL آپلود ویدیو بزرگ (حداکثر 5GB)

**مسیر:** `POST /api/admin/videos/upload-url`

**کاربرد:** دریافت URL امضا شده برای آپلود مستقیم ویدیوهای بزرگ به Object Storage

**احراز هویت:** ✅ لازم است (فقط ادمین)

**نوع درخواست:** `application/json`

**بدنه درخواست:**

```json
{
  "fileName": "lesson-01-intro.mp4",
  "fileSize": 524288000,
  "fileFormat": "mp4",
  "title": "درس اول: مقدمه",
  "description": "ویدیوی درس اول دوره آموزشی"
}
```

**پارامترها:**

| نام پارامتر | نوع | الزامی | توضیحات |
|------------|-----|--------|---------|
| `fileName` | String | ✅ | نام فایل ویدیو |
| `fileSize` | Number | ✅ | حجم فایل به بایت |
| `fileFormat` | String | ✅ | فرمت فایل (mp4, mov, avi, mkv, webm) |
| `title` | String | ✅ | عنوان ویدیو |
| `description` | String | ❌ | توضیحات ویدیو |

**محدودیت‌ها:**

- حجم فایل: حداکثر **5GB**
- فرمت‌های مجاز: **mp4, mov, avi, mkv, webm**

**پاسخ موفقیت‌آمیز:**

```json
{
  "success": true,
  "message": "URL آپلود با موفقیت ایجاد شد",
  "data": {
    "uploadUrl": "https://storage.example.com/videos/abc123/video.mp4?signature=...",
    "videoId": "vid_abc123xyz789",
    "storagePath": "videos/vid_abc123xyz789/lesson-01-intro_1234567890.mp4",
    "uniqueFileName": "lesson-01-intro_1234567890.mp4",
    "expiresAt": 1737115200000,
    "metadata": {
      "title": "درس اول: مقدمه",
      "description": "ویدیوی درس اول دوره آموزشی",
      "fileSize": 524288000,
      "fileFormat": "mp4"
    }
  }
}
```

**نحوه استفاده:**

1. درخواست این API را ارسال کنید و `uploadUrl` را دریافت کنید
2. از `uploadUrl` برای آپلود مستقیم فایل از مرورگر استفاده کنید (PUT request)
3. پس از آپلود، از `videoId` برای ثبت ویدیو در دیتابیس استفاده کنید

**مثال آپلود با JavaScript:**

```javascript
// 1. دریافت Upload URL
const response = await fetch('/api/admin/videos/upload-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fileName: file.name,
    fileSize: file.size,
    fileFormat: 'mp4',
    title: 'درس اول',
    description: 'توضیحات'
  })
});

const { data } = await response.json();

// 2. آپلود مستقیم فایل
await fetch(data.uploadUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': 'video/mp4'
  },
  body: file
});

// 3. ثبت در دیتابیس
await fetch('/api/admin/videos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videoId: data.videoId,
    title: data.metadata.title,
    originalPath: data.storagePath,
    fileSize: data.metadata.fileSize,
    fileFormat: data.metadata.fileFormat
  })
});
```

**توضیحات اضافی:**

- URL آپلود برای **1 ساعت** معتبر است
- این روش برای ویدیوهای بزرگ (دروس دوره‌ها) بهینه است
- آپلود مستقیم از مرورگر انجام می‌شود (بدون عبور از سرور)

---

### 3️⃣ ثبت ویدیو در دیتابیس و شروع پردازش HLS

**مسیر:** `POST /api/admin/videos`

**کاربرد:** ثبت اطلاعات ویدیو در دیتابیس و شروع پردازش HLS برای پخش امن (ویدیوهای دوره)

**احراز هویت:** ✅ لازم است (فقط ادمین)

**نوع درخواست:** `application/json`

**بدنه درخواست:**

```json
{
  "title": "درس اول: مقدمه React",
  "description": "در این درس با مفاهیم پایه React آشنا می‌شویم",
  "videoId": "vid_abc123xyz789",
  "originalPath": "videos/vid_abc123xyz789/lesson-01-intro_1234567890.mp4",
  "fileSize": 524288000,
  "fileFormat": "mp4",
  "duration": 1800,
  "width": 1920,
  "height": 1080,
  "bitrate": 2000000,
  "codec": "h264",
  "frameRate": 30,
  "startProcessing": true
}
```

**پارامترها:**

| نام پارامتر | نوع | الزامی | توضیحات |
|------------|-----|--------|---------|
| `title` | String | ✅ | عنوان ویدیو |
| `videoId` | String | ✅ | شناسه یکتای ویدیو (از API قبلی) |
| `originalPath` | String | ✅ | مسیر فایل در storage |
| `fileSize` | Number | ✅ | حجم فایل به بایت |
| `fileFormat` | String | ✅ | فرمت فایل |
| `description` | String | ❌ | توضیحات ویدیو |
| `duration` | Number | ❌ | مدت زمان ویدیو (ثانیه) |
| `width` | Number | ❌ | عرض ویدیو (پیکسل) |
| `height` | Number | ❌ | ارتفاع ویدیو (پیکسل) |
| `bitrate` | Number | ❌ | Bitrate ویدیو |
| `codec` | String | ❌ | کدک ویدیو |
| `frameRate` | Number | ❌ | نرخ فریم |
| `startProcessing` | Boolean | ❌ | آیا پردازش HLS شروع شود؟ (پیش‌فرض: true) |

**پاسخ موفقیت‌آمیز:**

```json
{
  "success": true,
  "message": "ویدیو با موفقیت ایجاد شد و پردازش آن شروع شد",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "videoId": "vid_abc123xyz789",
    "title": "درس اول: مقدمه React",
    "description": "در این درس با مفاهیم پایه React آشنا می‌شویم",
    "originalPath": "videos/vid_abc123xyz789/lesson-01-intro_1234567890.mp4",
    "hlsPath": null,
    "thumbnailPath": null,
    "processingStatus": "PENDING",
    "fileSize": 524288000,
    "fileFormat": "mp4",
    "duration": 1800,
    "width": 1920,
    "height": 1080,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

**پردازش HLS:**

زمانی که `startProcessing: true` باشد، سیستم به صورت خودکار:

1. ویدیو را به فرمت HLS تبدیل می‌کند
2. کیفیت‌های مختلف تولید می‌کند (360p, 720p)
3. Thumbnail از ویدیو ایجاد می‌کند
4. وضعیت پردازش را در دیتابیس به‌روزرسانی می‌کند

**وضعیت‌های پردازش:**

- `PENDING` - در صف پردازش
- `PROCESSING` - در حال پردازش
- `COMPLETED` - پردازش تکمیل شده
- `FAILED` - پردازش ناموفق

**توضیحات اضافی:**

- این API برای ویدیوهای **محرمانه و غیرقابل دانلود** (ویدیوهای دوره) استفاده می‌شود
- پس از پردازش، ویدیو به صورت HLS (Adaptive Streaming) در دسترس خواهد بود
- پردازش به صورت Background انجام می‌شود و سرور را بلاک نمی‌کند

---

### 4️⃣ دریافت لیست ویدیوها (ادمین)

**مسیر:** `GET /api/admin/videos`

**کاربرد:** مشاهده تمام ویدیوهای آپلود شده با فیلتر و pagination

**احراز هویت:** ✅ لازم است (فقط ادمین)

**پارامترهای Query:**

| نام پارامتر | نوع | الزامی | پیش‌فرض | توضیحات |
|------------|-----|--------|---------|---------|
| `page` | Number | ❌ | 1 | شماره صفحه |
| `limit` | Number | ❌ | 20 | تعداد آیتم‌ها در هر صفحه |
| `search` | String | ❌ | - | جستجو در عنوان و توضیحات |
| `status` | String | ❌ | - | فیلتر بر اساس وضعیت پردازش (PENDING, PROCESSING, COMPLETED, FAILED) |

**مثال درخواست:**

```
GET /api/admin/videos?page=1&limit=20&status=COMPLETED&search=React
```

---

## 📂 دسته‌بندی تصاویر

در هنگام آپلود تصویر از طریق `/api/admin/images`، باید یکی از دسته‌بندی‌های زیر را مشخص کنید:

| مقدار | کاربرد | مثال |
|-------|--------|------|
| `PROFILE` | تصویر پروفایل کاربران | عکس پروفایل مدرس، کاربران |
| `COURSE` | تصاویر دوره‌ها | عکس کاور دوره‌های آموزشی |
| `BOOK` | تصاویر کتاب‌ها | جلد کتاب‌ها |
| `NEWS` | تصاویر اخبار | عکس اخبار و مقالات |
| `RESUME` | تصاویر رزومه | تصاویر مرتبط با رزومه |
| `CERTIFICATE` | تصاویر گواهینامه | گواهینامه‌های دوره |
| `TEAM` | تصاویر اعضای تیم | عکس اعضای تیم شرکت |
| `LANDING` | تصاویر صفحات لندینگ | بنرها، اسلایدرها، تصاویر صفحه اصلی |
| `OTHER` | سایر موارد | تصاویر عمومی و متفرقه |

---

## ⚙️ محدودیت‌ها و قوانین

### تصاویر

| مورد | مقدار |
|------|-------|
| حجم فایل (آواتار) | حداکثر **2MB** |
| حجم فایل (ادمین) | حداکثر **10MB** |
| فرمت‌های مجاز (آواتار) | JPG, JPEG, PNG, WEBP |
| فرمت‌های مجاز (ادمین) | JPG, JPEG, PNG, GIF, WEBP, SVG |

### ویدیوها

| مورد | مقدار |
|------|-------|
| حجم فایل (آپلود مستقیم) | حداکثر **256MB** |
| حجم فایل (آپلود غیرمستقیم) | حداکثر **5GB** |
| فرمت‌های مجاز | MP4, MOV, AVI, MKV, WEBM |
| اعتبار URL آپلود | **1 ساعت** |
| کیفیت‌های HLS | 360p, 720p |
| مدت زمان سگمنت HLS | 6 ثانیه |

### احراز هویت

- تمام API های ادمین نیاز به نقش `ADMIN` دارند
- API آپلود آواتار برای همه کاربران لاگین شده قابل دسترسی است

---

## 💻 نمونه کد

### آپلود تصویر دوره (React)

```tsx
async function uploadCourseImage(file: File, title: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', 'COURSE');
  formData.append('title', title);
  formData.append('alt', title);
  formData.append('tags', 'دوره,آموزش');

  const response = await fetch('/api/admin/images', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('خطا در آپلود تصویر');
  }

  const result = await response.json();
  console.log('URL تصویر:', result.data.url);
  return result.data;
}
```

### آپلود آواتار کاربر (React)

```tsx
async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch('/api/user/upload-avatar', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('خطا در آپلود آواتار');
  }

  const result = await response.json();
  console.log('URL آواتار:', result.data.avatarUrl);
  return result.data.avatarUrl;
}
```

### آپلود ویدیو کوچک (مستقیم)

```tsx
async function uploadSmallVideo(file: File) {
  if (file.size > 256 * 1024 * 1024) {
    throw new Error('حجم فایل نباید بیشتر از 256MB باشد');
  }

  const formData = new FormData();
  formData.append('video', file);

  const response = await fetch('/api/admin/upload-video', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('خطا در آپلود ویدیو');
  }

  const result = await response.json();
  console.log('URL ویدیو:', result.data.videoUrl);
  return result.data;
}
```

### آپلود ویدیو بزرگ با HLS (کامل)

```tsx
async function uploadLargeVideo(
  file: File,
  title: string,
  description?: string,
  onProgress?: (progress: number) => void
) {
  // مرحله 1: دریافت URL آپلود
  const urlResponse = await fetch('/api/admin/videos/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileSize: file.size,
      fileFormat: file.name.split('.').pop()?.toLowerCase() || 'mp4',
      title,
      description,
    }),
  });

  if (!urlResponse.ok) {
    throw new Error('خطا در دریافت URL آپلود');
  }

  const { data } = await urlResponse.json();

  // مرحله 2: آپلود فایل به Object Storage
  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable && onProgress) {
      const progress = (e.loaded / e.total) * 100;
      onProgress(progress);
    }
  });

  await new Promise((resolve, reject) => {
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(new Error('خطا در آپلود فایل'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('خطای شبکه'));
    });

    xhr.open('PUT', data.uploadUrl);
    xhr.setRequestHeader('Content-Type', `video/${data.metadata.fileFormat}`);
    xhr.send(file);
  });

  // مرحله 3: ثبت ویدیو در دیتابیس و شروع پردازش HLS
  const videoResponse = await fetch('/api/admin/videos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      videoId: data.videoId,
      title: data.metadata.title,
      description: data.metadata.description,
      originalPath: data.storagePath,
      fileSize: data.metadata.fileSize,
      fileFormat: data.metadata.fileFormat,
      startProcessing: true,
    }),
  });

  if (!videoResponse.ok) {
    throw new Error('خطا در ثبت ویدیو');
  }

  const videoResult = await videoResponse.json();
  console.log('ویدیو ثبت شد:', videoResult.data);
  return videoResult.data;
}
```

### استفاده از Hook سفارشی (React Query)

```tsx
import { useMutation } from '@tanstack/react-query';

function useUploadVideo() {
  return useMutation({
    mutationFn: async ({
      file,
      title,
      description
    }: {
      file: File;
      title: string;
      description?: string
    }) => {
      // استفاده از تابع uploadLargeVideo که بالاتر تعریف کردیم
      return uploadLargeVideo(file, title, description);
    },
    onSuccess: (data) => {
      console.log('ویدیو با موفقیت آپلود شد:', data);
    },
    onError: (error) => {
      console.error('خطا در آپلود:', error);
    },
  });
}

// استفاده در کامپوننت
function UploadVideoForm() {
  const uploadMutation = useUploadVideo();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('video') as File;
    const title = formData.get('title') as string;

    uploadMutation.mutate({ file, title });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" required />
      <input type="file" name="video" accept="video/*" required />
      <button type="submit" disabled={uploadMutation.isPending}>
        {uploadMutation.isPending ? 'در حال آپلود...' : 'آپلود'}
      </button>
    </form>
  );
}
```

---

## 📊 خلاصه تصمیم‌گیری: کدام API را استفاده کنیم؟

### برای تصاویر:

| سناریو | API مناسب |
|--------|-----------|
| آپلود آواتار کاربر | `POST /api/user/upload-avatar` |
| آپلود عکس دوره | `POST /api/admin/images` با `category=COURSE` |
| آپلود عکس کتاب | `POST /api/admin/images` با `category=BOOK` |
| آپلود عکس خبر | `POST /api/admin/images` با `category=NEWS` |
| آپلود عکس اعضای تیم | `POST /api/admin/images` با `category=TEAM` |
| آپلود بنر صفحه اصلی | `POST /api/admin/images` با `category=LANDING` |

### برای ویدیوها:

| سناریو | API مناسب |
|--------|-----------|
| ویدیوی معرفی کوتاه (< 256MB) | `POST /api/admin/upload-video` |
| ویدیوی توضیحات دوره (< 256MB) | `POST /api/admin/upload-video` |
| تریلر دوره (< 256MB) | `POST /api/admin/upload-video` |
| **ویدیوی درس دوره (محرمانه)** | `POST /api/admin/videos/upload-url` ➜ `POST /api/admin/videos` |
| ویدیوی آموزشی بزرگ (> 256MB) | `POST /api/admin/videos/upload-url` ➜ `POST /api/admin/videos` |

---

## ❓ سوالات متداول

### چرا برای ویدیوهای دوره باید از HLS استفاده کنیم؟

- **امنیت:** ویدیوها به صورت Encrypted ذخیره می‌شوند و قابل دانلود مستقیم نیستند
- **کیفیت تطبیقی:** بسته به سرعت اینترنت، کیفیت مناسب انتخاب می‌شود
- **عملکرد بهتر:** ویدیو به قطعات کوچک تقسیم می‌شود و پخش سریع‌تر است

### چرا دو روش آپلود ویدیو داریم؟

- **آپلود مستقیم (`/upload-video`)**: برای ویدیوهای کوچک که نیاز به پردازش ندارند
- **آپلود غیرمستقیم (`/videos/upload-url`)**: برای ویدیوهای بزرگ که نیاز به پردازش HLS دارند

### چطور می‌توانم پیشرفت آپلود را نمایش دهم؟

از `XMLHttpRequest` یا کتابخانه‌هایی مثل `axios` با `onUploadProgress` استفاده کنید.

---

## 🔗 منابع مرتبط

- [سرویس مدیریت تصاویر](/lib/services/image-service.ts)
- [سرویس مدیریت ویدیو](/lib/services/video-service.ts)
- [سرویس پردازش HLS](/lib/services/hls-transcoding-service.ts)
- [انواع داده ویدیو](/types/video.ts)

---

**تاریخ به‌روزرسانی:** 2025-01-20
**نسخه:** 1.0.0
