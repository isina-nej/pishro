# 📚 سیستم بلاگ حرفه‌ای با Markdown M2

سیستم نوشین پخش‌کننده محتوا برای ایجاد و مدیریت بلاگ‌های حرفه‌ای با پشتیبانی کامل Markdown M2.

## ✨ ویژگی‌ها

### 📝 ادیتور حرفه‌ای
- **Live Preview**: مشاهده فوری نتیجه Markdown در هنگام ویرایش
- **Markdown Toolbar**: دکمه‌های آسان برای توپرفایی، کج، کد، لیست، و غیره
- **Image Upload**: قابلیت درج تصاویر مستقیم در متن
- **Code Highlighting**: نمایش بلاک‌های کد با رنگ‌آمیزی سینتکسی

### 🎨 نمایش عمومی
- **Responsive Design**: طراحی شامل برای تمام دستگاه‌ها
- **Professional Typography**: کتاب‌چینی حرفه‌ای برای خوانایی بهتر
- **Reading Time**: محاسبه خودکار زمان مطالعه
- **Author Info**: نمایش اطلاعات نویسنده
- **Beautiful Rendering**: نمایش Markdown با استایل‌های حرفه‌ای

### 🔧 مدیریت محتوا
- **Metadata Management**: مدیریت عنوان، خلاصه، دسته‌بندی، تصویر شاخص
- **Publishing Control**: انتشار فوری یا برنامه‌ریزی برای تاریخ مشخص
- **Draft System**: ذخیره‌ی پیش‌نویس قبل از انتشار
- **Archive**: پنهان کردن بلاگ‌های قدیمی

## 📂 ساختار فایل‌ها

```
/lib/utils/markdown.ts                    # Markdown Parser & Utilities
/components/BlockNews/
  ├─ MarkdownEditor.tsx                   # Professional Markdown Editor
  ├─ MarkdownPreview.tsx                  # Live Preview Component
  └─ ...

/app/admin/blog/
  ├─ create/page.tsx                      # Create New Blog Page
  ├─ [id]/edit/page.tsx                   # Edit Blog Page
  └─ ...

/app/blog/
  ├─ page.tsx                             # Blog List Page (Public)
  └─ [slug]/page.tsx                      # Single Blog Post Page (Public)

/app/api/public/blog/
  ├─ route.ts                             # List all published posts
  └─ [slug]/route.ts                      # Get single post
```

## 🚀 شروع سریع

### 1. صفحه ساخت بلاگ جدید
```
👉 /admin/blog/create

- عنوان بلاگ را وارد کنید
- خلاصه‌ی مقاله را بنویسید
- تصویر شاخص را آپلود کنید
- محتوا را با Markdown بنویسید
- کلیک کنید: "انتشار و ویرایش"
```

### 2. صفحه ویرایش بلاگ
```
👉 /admin/blog/[id]/edit

تب‌ها:
  📝 محتوا: ویرایش متن Markdown
  🏷️ اطلاعات: عنوان، خلاصه، تصویر
  📤 انتشار: انتشار فوری یا برنامه‌ریزی
```

### 3. مشاهده بلاگ‌های عمومی
```
👉 /blog
  - لیست تمام بلاگ‌های منتشر‌شده
  - جستجو در بلاگ‌ها
  - کلیک برای مطالعه

👉 /blog/[slug]
  - صفحه کامل بلاگ
  - نمایش نویسنده و تاریخ
  - زمان مطالعه
  - بازدید‌ها
```

## 📖 Markdown Syntax

### عناوین
```markdown
# عنوان 1
## عنوان 2
### عنوان 3
```

### فرمت‌بندی متن
```markdown
**متن توپرفا**
*متن کج*
`کد درون‌خطی`
```

### لیست‌ها
```markdown
- مورد ۱
- مورد ۲
- مورد ۳

1. مورد اول
2. مورد دوم
3. مورد سوم
```

### تصاویر و پیوند‌ها
```markdown
![توضیح](image-url)
[متن پیوند](https://example.com)
```

### کد بلاک
```markdown
```javascript
const hello = "world";
```
```

### نقل‌قول
```markdown
> این یک نقل‌قول است
> و می‌تواند چند خط باشد
```

### خط جدا‌کننده
```markdown
---
```

## 🛠️ API Endpoints

### دریافت بلاگ‌ها
```bash
GET /api/public/blog
GET /api/public/blog?page=1&limit=12&search=query
```

### دریافت یک بلاگ
```bash
GET /api/public/blog/[slug]
```

### مدیریت بلاگ (ادمین)
```bash
GET /api/admin/block-news/[id]
PATCH /api/admin/block-news/[id]
PATCH /api/admin/block-news/[id]/status
```

## 🎨 استایل‌کاری

تمام کامپوننت‌ها از:
- **Tailwind CSS**: کلاس‌های مفیدانه برای طراحی
- **Dark Mode**: پشتیبانی کامل حالت تاریک
- **RTL**: چینش راست‌به‌چپ برای فارسی

## 📱 Responsive

- **Mobile**: تک‌ستون، متن بزرگ‌تر
- **Tablet**: دو ستون، layout متوازن
- **Desktop**: سه ستون، layout بهینه

## 🔐 امنیت

- تمام مقالات منتشر‌شده فقط از طریق API عمومی قابل دسترسی
- درخواست‌های ادمین نیاز به Authorization token دارند
- فقط مقالات با `published: true` و `publishedAt <= now()` نمایش داده می‌شوند

## 🐛 Debugging

### مسائل رایج

**مسئله**: تصویرها نمایش داده نمی‌شوند
- حل: URL تصویر باید صحیح باشد و قابل دسترسی

**مسئله**: Markdown به درستی نمایش داده نمی‌شود
- حل: سینتکس Markdown را بررسی کنید، فاصله‌ها مهم هستند

**مسئله**: بلاگ بعد از انتشار نمایش داده نمی‌شود
- حل: مطمئن شوید `publishedAt` تاریخ تا الآن است

## 📞 پشتیبانی

برای سؤالات یا مشکلات:
1. بررسی console برای خطاهای JavaScript
2. بررسی Network tab برای خطاهای API
3. بررسی database برای صحت داده‌ها

---

**نسخه**: 1.0.0  
**آخرین به‌روز‌رسانی**: 2024  
**ساخت‌شده با**: Next.js 15 + Markdown + Tailwind CSS
