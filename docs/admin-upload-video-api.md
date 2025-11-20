# Admin Upload Video API

## Endpoint
```
POST /api/admin/upload-video
```

## محدودیت‌ها
- **حجم فایل**: حداکثر 256 مگابایت
- **فرمت‌های مجاز**: MP4, MOV, AVI, MKV, WebM
- **دسترسی**: فقط ادمین

## Request

### Headers
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Body (Form Data)
| فیلد | نوع | الزامی | توضیحات |
|------|-----|--------|---------|
| video | File | ✅ | فایل ویدیو |

## Response

### موفقیت‌آمیز (200 OK)
```json
{
  "success": true,
  "data": {
    "videoUrl": "/uploads/videos/video_1234567890_abc123.mp4",
    "filename": "video_1234567890_abc123.mp4",
    "fileSize": 52428800,
    "fileType": "video/mp4"
  },
  "message": "ویدیو با موفقیت آپلود شد"
}
```

### خطاها

#### عدم احراز هویت (401 Unauthorized)
```json
{
  "success": false,
  "message": "لطفاً وارد حساب کاربری خود شوید"
}
```

#### عدم دسترسی (401 Unauthorized)
```json
{
  "success": false,
  "message": "دسترسی غیرمجاز - فقط ادمین"
}
```

#### فایل ارسال نشده (400 Bad Request)
```json
{
  "success": false,
  "message": "فایل ویدیو الزامی است",
  "errors": {
    "video": "فایل ویدیو الزامی است"
  }
}
```

#### فرمت نامعتبر (400 Bad Request)
```json
{
  "success": false,
  "message": "فقط فرمت‌های MP4، MOV، AVI، MKV و WebM مجاز هستند",
  "errors": {
    "video": "فقط فایل‌های ویدیویی مجاز هستند"
  }
}
```

#### حجم بیش از حد (400 Bad Request)
```json
{
  "success": false,
  "message": "حجم فایل نباید بیشتر از 256 مگابایت باشد",
  "errors": {
    "video": "حجم فایل نباید بیشتر از 256 مگابایت باشد"
  }
}
```

## کاربرد
این ویدیوها در بخش‌های زیر استفاده می‌شوند:
- **جزئیات دوره‌ها**: فیلد `introVideoUrl` در مدل `Course`
- **صفحه درباره ما**: فیلد `doctorIntroVideoUrl` در مدل `AboutPage`

## مثال استفاده (JavaScript)
```javascript
const formData = new FormData();
formData.append('video', videoFile);

const response = await fetch('/api/admin/upload-video', {
  method: 'POST',
  body: formData
});

const result = await response.json();
if (result.success) {
  console.log('Video URL:', result.data.videoUrl);
}
```
