# 🚀 MDXEditor Quick Start Guide

**تاریخ**: 22 خرداد 1405  
**وضعیت**: ✅ آماده استفاده

---

## 📋 فهرست

1. [شروع سریع](#شروع-سریع)
2. [ویژگی‌های اصلی](#ویژگی‌های-اصلی)
3. [نحوه استفاده](#نحوه-استفاده)
4. [مثال‌های عملی](#مثال‌های-عملی)
5. [راهنمایی‌های سریع](#راهنمایی‌های-سریع)

---

## شروع سریع

### 1️⃣ دسترسی به ویرایشگر

```bash
# بروید به صفحه ایجاد مقاله
http://localhost:3000/admin/news/create-mdx
```

### 2️⃣ ایجاد مقاله جدید

1. **عنوان را وارد کنید**
   - مثال: "معرفی فناوری جدید"

2. **محتوا را بنویسید**
   - از Markdown استفاده کنید
   - تصاویر را بکشید و رها کنید

3. **دسته‌بندی انتخاب کنید** (اختیاری)
   - عمومی
   - فناوری
   - کسب‌وکار
   - آموزش

4. **خلاصه بنویسید** (اختیاری)
   - برای نمایش در لیست‌ها

5. **ذخیره یا انتشار کنید**
   - "ذخیره پیش‌نویس": برای بعدا
   - "انتشار": برای ارائه به عموم

---

## ویژگی‌های اصلی

### ✨ ویرایشگر غنی

```markdown
# عنوان بزرگ
## عنوان متوسط
### عنوان کوچک

**متن پررنگ**
*متن کج*
~~متن خط‌خورده~~

- لیست نقطه‌ای
- آیتم دوم

1. لیست شماره‌دار
2. آیتم دوم

> نقل‌قول
> خط دوم

[لینک](https://example.com)
![توضیح تصویر](https://example.com/image.jpg)

```javascript
// کد
console.log('سلام دنیا');
```

| ستون 1 | ستون 2 |
|-------|-------|
| سلول   | سلول  |
```

### 📸 تصاویر

```
✓ درگ و ریلیز (Drag & Drop)
✓ آپلود مستقیم
✓ لینک URL
✓ تغییر اندازه
```

### 🎯 میانبرهای صفحه‌کلید

| میانبر | عملکرد |
|-------|---------|
| `Ctrl+B` | **پررنگ** |
| `Ctrl+I` | *کج* |
| `Ctrl+K` | لینک |
| `Tab` | تورفتگی |
| `Shift+Tab` | کاهش تورفتگی |

---

## نحوه استفاده

### مثال 1: مقاله ساده

```
عنوان: نکات مهم در Python

محتوا:
# نکات مهم در Python

## بخش اول

Python زبان برنامه‌نویسی قدرتمندی است.

## بخش دوم

از دستورات ساده شروع کنید:

```python
name = "پیشرو"
print(f"سلام {name}")
```

---

### مثال 2: مقاله با تصویر

```
عنوان: آموزش Git

محتوا:
# یادگیری Git

![Git Logo](https://git-scm.com/images/logo.svg)

Git ابزار کنترل نسخه است.

## دستورات اساسی

```bash
git clone <repo>
git add .
git commit -m "پیام"
git push
```
```

---

## مثال‌های عملی

### 1. استفاده در کامپوننت React

```tsx
'use client';

import { useRef } from 'react';
import { MDXNewsEditor } from '@/components/news/MDXNewsEditor';
import { mdxNewsService } from '@/lib/services/mdx-news-service';

export default function MyArticleEditor() {
  const editorRef = useRef(null);

  const handleSave = async (data: { title: string; content: string }) => {
    try {
      const article = await mdxNewsService.createArticle({
        ...data,
        draft: true,
      });
      console.log('Saved:', article);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <MDXNewsEditor
      ref={editorRef}
      initialTitle="عنوان جدید"
      onSave={handleSave}
      autoSaveEnabled={false}
    />
  );
}
```

### 2. استفاده از Service

```typescript
import { mdxNewsService } from '@/lib/services/mdx-news-service';

// ایجاد مقاله
const article = await mdxNewsService.createArticle({
  title: 'عنوان',
  content: '# محتوا',
  draft: false,
  category: 'فناوری',
});

// دریافت مقاله
const article = await mdxNewsService.getArticle(articleId);

// ویرایش
await mdxNewsService.updateArticle(articleId, {
  title: 'عنوان جدید',
});

// انتشار
await mdxNewsService.publishArticle(articleId);

// حذف
await mdxNewsService.deleteArticle(articleId);
```

### 3. تبدیل HTML به Markdown

```typescript
import { htmlToMarkdown } from '@/lib/utils/mdx-editor-utils';

const html = '<h1>عنوان</h1><p>محتوا</p>';
const markdown = htmlToMarkdown(html);
// نتیجه: # عنوان\n\nمحتوا
```

### 4. اعتبارسنجی محتوا

```typescript
import { validateMarkdown } from '@/lib/utils/mdx-editor-utils';

const result = validateMarkdown(content);
if (result.valid) {
  console.log('محتوا معتبر است');
} else {
  console.log('خطاها:', result.errors);
  console.log('هشدارها:', result.warnings);
}
```

---

## راهنمایی‌های سریع

### 💡 نکات مفید

1. **ذخیره خودکار**
   - پیش‌نویس‌ها باید دستی ذخیره شوند
   - داده‌های شما تا ذخیره آنلاین نیست محفوظ نیست

2. **تصاویر**
   - حداکثر اندازه: 5 مگابایت
   - فرمت‌های پشتیبانی: JPG, PNG, WebP, GIF

3. **Markdown**
   - مرجع Markdown: https://www.markdownguide.org/
   - نمایش زنده: سمت راست ویرایشگر

4. **منتشر کردن**
   - پس از انتشار، قابل تغییر است
   - فقط کاربران مجاز می‌توانند ویرایش کنند

### 🐛 رفع مشکلات عام

**مشکل**: ویرایشگر نمی‌شود لود  
**حل**: کش را پاک کنید و صفحه را رفرش کنید
```bash
rm -rf .next
npm run dev
```

**مشکل**: تصاویر آپلود نمی‌شوند  
**حل**: اندازه و فرمت فایل را بررسی کنید

**مشکل**: متن RTL نیست  
**حل**: Reload کنید - باید خودکار RTL شود

### 📱 بر روی دستگاه‌های مختلف

- **رومیزی**: تجربه کامل
- **تبلت**: بهتر است landscape
- **موبایل**: نیاز به بهتر‌سازی

---

## 🎓 منابع اضافی

- [مستندات MDXEditor](https://mdxeditor.dev/)
- [راهنمای Markdown](https://www.markdownguide.org/)
- [مستندات Pishro](../README.md)
- [راهنمای کامل MDXEditor](./MDXEDITOR_GUIDE.md)

---

## 📞 درخواست کمک

اگر مشکلی دارید:

1. مستندات را بررسی کنید
2. مرورگر DevTools را چک کنید (F12)
3. لاگ‌های سرور را ببینید
4. سوال بپرسید

---

**موفق باشید! 🎉**
