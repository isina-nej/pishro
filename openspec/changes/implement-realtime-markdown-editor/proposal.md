# Proposal: Real-time Markdown Editor for News Admin

## Why

ادمین باید هنگام نوشتن خبر با Markdown، خروجی رندر شده را همان لحظه ببیند و محتوای عمومی خبر بدون کامپایل مجدد Markdown در هر بازدید نمایش داده شود. ذخیره HTML امن و آماده، زمان لود صفحه عمومی را کاهش می‌دهد و تجربه ادمین را قابل پیش‌بینی‌تر می‌کند.

## Current Problem

- فرم‌های فعلی خبر خروجی Markdown زنده و قابل اتکا برای ادمین ارائه نمی‌کنند.
- مدل داده فقط `content` را به عنوان محتوای اصلی نگه می‌دارد و Markdown خام برای ویرایش‌های بعدی جدا نشده است.
- صفحه عمومی برای محتواهای Markdown یا HTML-wrapper شده مسیرهای تشخیص و رندر کلاینتی دارد که برای خبرهای جدید نباید لازم باشد.
- اگر HTML بدون Sanitization پایدار شود، ریسک Stored XSS وجود دارد.

## Proposed Change

- افزودن ادیتور Markdown با پیش‌نمایش زنده در پنل ادمین خبر، با split-view در دسکتاپ و تب‌های ویرایش/پیش‌نمایش در موبایل.
- تبدیل Markdown به HTML امن در حین تایپ برای پیش‌نمایش ادمین.
- ارسال Markdown خام و HTML رندر شده در submit، ولی تولید و Sanitization نهایی HTML در سرور.
- ذخیره `content_markdown` برای ویرایش بعدی، `content_html` برای نمایش عمومی، و نگه داشتن `content` به عنوان HTML canonical برای سازگاری مسیرهای موجود.
- نمایش عمومی خبر با HTML ذخیره شده و بدون اجرای کامپایلر Markdown برای خبرهای جدید.

## In Scope

- کامپوننت ادیتور Markdown و پیش‌نمایش آنی.
- Debounce کوتاه برای جلوگیری از re-render سنگین در تایپ سریع.
- Sanitization سمت سرور و سمت پیش‌نمایش.
- تغییر Prisma schema و migration برای ذخیره Markdown خام و HTML آماده.
- به‌روزرسانی APIهای ایجاد خبر و سرویس خواندن خبر.
- به‌روزرسانی صفحه جزئیات خبر برای اولویت دادن به HTML ذخیره شده.
- تست واحد برای تبدیل و پاک‌سازی Markdown.

## Out of Scope

- جایگزینی با WYSIWYGهای سنگین مانند TinyMCE یا CKEditor.
- سیستم آپلود تصویر داخل Markdown فراتر از لینک‌های موجود.
- بازطراحی کامل داشبورد مدیریت خبر.

## Risks and Mitigations

- **Stored XSS:** HTML نهایی در سرور با DOMPurify پاک‌سازی می‌شود و `content_html` ارسالی کلاینت trusted محسوب نمی‌شود.
- **ناسازگاری داده‌های قدیمی:** `content` حفظ می‌شود و برای رکوردهای قدیمی fallback باقی می‌ماند.
- **Hydration mismatch:** خبرهای جدید HTML آماده را مستقیم inject می‌کنند و کامپایل Markdown در کلاینت فقط fallback legacy است.
- **Lag در تایپ:** رندر پیش‌نمایش با debounce کوتاه و کامپوننت ایزوله انجام می‌شود.

## Discovery Summary

- پروژه Next.js 15، React 19، TypeScript، Prisma و MySQL است.
- پکیج‌های `marked`، `dompurify`، `isomorphic-dompurify` و `react-markdown` از قبل در `package.json` وجود دارند.
- مدل اصلی خبر `NewsArticle` در `prisma/schema.prisma` است.
- فرم‌های مرتبط: `app/admin/news/create/page.tsx` و `app/admin/block-news/create/page.tsx`.
- APIهای مرتبط: `app/api/news/create/route.ts`، `app/api/admin/news/route.ts` و `app/api/admin/block-news/route.ts`.
- صفحه عمومی خبر: `app/(routes)/news/[slug]/page.tsx` و `components/news/NewsArticleDetail.tsx`.
