# 📚 پنل مدیریت کتابخانه دیجیتالی

## 🎯 امکانات

صفحه جدید مدیریت کتابخانه در پنل ادمین با قابلیت‌های زیر ساخته شده است:

### ✨ ویژگی‌ها

1. **📋 لیست کتاب‌ها**
   - مشاهده تمام کتاب‌های دیجیتالی
   - جستجو بر اساس عنوان یا نویسنده
   - فیلترکردن بر اساس دسته‌بندی
   - نمایش تعداد بازدید و دانلود برای هر کتاب

2. **➕ اضافه کردن کتاب جدید**
   - فرم کامل برای ثبت کتاب
   - مشخص کردن تمام اطلاعات کتاب
   - انتخاب فرمت‌های موجود (جلد سخت، نرم، الکترونیکی، صوتی)
   - مشخص کردن وضعیت (جدید، پرفروش، ویژه)
   - آپلود لینک‌های فایل PDF و صوتی

3. **✏️ ویرایش کتاب‌ها**
   - ویرایش تمام اطلاعات کتاب
   - تغییر توضیحات و متادیتا
   - به‌روزرسانی لینک‌های رسانه

4. **🗑️ حذف کتاب‌ها**
   - حذف کتاب‌های دیجیتالی
   - تایید قبل از حذف

---

## 📂 ساختار فایل‌ها

```
app/admin/library/
├── page.tsx                 # صفحه اصلی (لیست کتاب‌ها)
├── create/
│   └── page.tsx            # صفحه ایجاد کتاب جدید
└── [id]/
    └── page.tsx            # صفحه ویرایش کتاب

app/api/library/
├── route.ts                # GET (لیست) و POST (ایجاد)
└── [id]/
    └── route.ts            # GET، PUT (ویرایش)، DELETE (حذف)

lib/services/
└── library-mysql.ts        # Functions دیتابیس:
                            # - getBooks()
                            # - getBookById()
                            # - getBookBySlug()
                            # - createBook()
                            # - updateBook()
                            # - deleteBook()
```

---

## 🔌 API Endpoints

### لیست و ایجاد
```
GET  /api/library?page=1&limit=12&category=&sort=newest
POST /api/library
```

### جزئیات، ویرایش و حذف
```
GET    /api/library/[id]
PUT    /api/library/[id]
DELETE /api/library/[id]
```

---

## 📊 اطلاعات کتاب

```typescript
{
  // اطلاعات پایه‌ای
  id: string;                    // شناسه یکتا
  title: string;                 // عنوان کتاب
  slug: string;                  // URL-friendly identifier
  author: string;                // نویسنده
  description: string;           // توضیحات کتاب
  
  // نشریات
  publisher: string;             // نام ناشر
  year: number;                  // سال انتشار
  pages: number;                 // تعداد صفحات
  isbn: string;                  // کد ISBN
  language: string;              // زبان
  
  // دسته‌بندی
  category: string;              // دسته (بورس، ارز، کسب و کار، ...)
  tags: string[];                // برچسب‌ها
  
  // رسانه
  cover: string;                 // URL تصویر جلد
  fileUrl: string;               // URL فایل PDF
  audioUrl: string;              // URL فایل صوتی
  formats: string[];             // فرمت‌های موجود
  
  // وضعیت
  status: string[];              // وضعیت (جدید، پرفروش، ویژه)
  isFeatured: boolean;           // آیا منتخب است؟
  
  // آمار
  rating: number;                // امتیاز (0-10)
  votes: number;                 // تعداد رای‌ها
  views: number;                 // تعداد بازدید
  downloads: number;             // تعداد دانلود
  
  // اضافی
  price: number;                 // قیمت
  readingTime: string;           // زمان مطالعه تخمینی
  
  // زمان‌ها
  createdAt: string;             // تاریخ ایجاد
  updatedAt: string;             // تاریخ آخرین ویرایش
}
```

---

## 🚀 استفاده

### دسترسی به صفحه
```
/admin/library              # لیست کتاب‌ها
/admin/library/create       # ایجاد کتاب جدید
/admin/library/[id]         # ویرایش کتاب
```

### از منوی ادمین
1. وارد `/admin/dashboard` شوید
2. روی لینک "📚 کتابخانه" کلیک کنید

---

## 🎨 رابط کاربری

### صفحه لیست
- جستجو در عنوان و نویسنده
- فیلترکردن بر اساس دسته‌بندی
- نمایش اطلاعات در جدول
- دکمه‌های ویرایش و حذف

### صفحه ایجاد/ویرایش
- فرم پر شده با مقادیر پیشفرض
- تقسیم بندی به بخش‌های منطقی
- نمایش خودکار slug از عنوان
- انتخاب گزینه‌های چندگانه برای فرمت‌ها و وضعیت‌ها

---

## 🔒 نکات ایمنی

- تمام درخواست‌های API دارای validation هستند
- فیلدهای الزامی: عنوان، نویسنده، دسته‌بندی
- حذف کتاب نیاز به تایید دارد
- تمام خطاها به صورت مناسب مدیریت می‌شوند

---

## 📝 مثال استفاده

### ایجاد کتاب جدید
```bash
curl -X POST http://localhost:3000/api/library \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ذهن میلیونر کریپتو",
    "slug": "crypto-mindset",
    "author": "آرمان صفوی",
    "category": "ارز دیجیتال",
    "description": "نحوه تفکر معامله‌گران بزرگ",
    "year": 2025,
    "language": "فارسی",
    "formats": ["الکترونیکی", "صوتی"],
    "isFeatured": true
  }'
```

### ویرایش کتاب
```bash
curl -X PUT http://localhost:3000/api/library/book_123456 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ذهن میلیونر کریپتو - ویرایش جدید",
    "rating": 9.5
  }'
```

### حذف کتاب
```bash
curl -X DELETE http://localhost:3000/api/library/book_123456
```

---

## ✅ تست‌های توصیه شده

1. ✔️ اضافه کردن کتاب جدید
2. ✔️ جستجو برای کتاب اضافه شده
3. ✔️ ویرایش اطلاعات کتاب
4. ✔️ فیلترکردن بر اساس دسته‌بندی
5. ✔️ حذف کتاب (با تایید)

---

## 🐛 رفع خرابی‌ها

اگر صفحه کار نکرد:

1. بررسی کنید که دیتابیس MySQL متصل است
2. جدول `DigitalBook` وجود دارد
3. API route‌ها به درستی کار می‌کنند
4. توکن احراز هویت معتبر است

---

**ساخته شده برای: پیشرو سرمایه** 🚀
