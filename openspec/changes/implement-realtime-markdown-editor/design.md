# Design: Real-time Markdown Editor for News Admin

## Technical Approach

پروژه از اکوسیستم JavaScript/TypeScript استفاده می‌کند، بنابراین از ابزارهای موجود خود پروژه استفاده می‌شود:

- `marked` برای تبدیل Markdown به HTML.
- `isomorphic-dompurify` برای Sanitization در سرور و کلاینت.
- `components/admin/news/MarkdownEditor.tsx` به عنوان ادیتور ایزوله Markdown با پیش‌نمایش زنده.
- `lib/markdown-processor.ts` به عنوان مرجع واحد تبدیل Markdown، تولید excerpt و محاسبه زمان مطالعه.

## Data Flow

```text
Admin types Markdown
  -> React state updates immediately
  -> debounced parser renders Markdown to sanitized HTML
  -> preview pane displays HTML
  -> form submit sends content_markdown and content_html
  -> server ignores trust boundary and regenerates sanitized HTML from Markdown
  -> database stores content_markdown, content_html, and legacy content as HTML
  -> public news detail reads content_html
  -> page injects pre-rendered sanitized HTML
```

## API and Database Implications

- `NewsArticle.content` باقی می‌ماند و HTML امن canonical را نگه می‌دارد تا مسیرهای قدیمی نشکنند.
- دو ستون اختیاری اضافه می‌شوند:
  - `content_markdown` برای Markdown خام قابل ویرایش.
  - `content_html` برای HTML امن و آماده نمایش.
- APIهای ایجاد خبر ورودی‌های زیر را می‌پذیرند:
  - `content_markdown` / `contentMarkdown`
  - `content_html` / `contentHtml`
  - `content` برای سازگاری قدیمی
- برای ورودی Markdown، سرور HTML را خودش از Markdown تولید می‌کند و `content_html` ارسالی کلاینت را فقط به عنوان داده کمکی غیرقابل اعتماد در نظر می‌گیرد.

## Rendering Strategy

- ادمین در دسکتاپ split-view می‌بیند: textarea سمت راست و preview سمت چپ.
- در موبایل به دلیل محدودیت عرض، تب‌های ادیتور و پیش‌نمایش نمایش داده می‌شوند.
- پیش‌نمایش empty state فارسی دارد: `چیزی برای نمایش وجود ندارد. تایپ را شروع کنید...`
- صفحه عمومی ابتدا `contentHtml` یا `content_html` را استفاده می‌کند و فقط برای رکوردهای legacy به مسیرهای Markdown/ProseMirror قبلی برمی‌گردد.

## Security Considerations

- `DOMPurify` تگ‌ها و attributeهای غیرمجاز را حذف می‌کند.
- تگ‌های `script`، `iframe`، `object`، `embed` و attributeهای event-handler مانند `onload` و `onerror` ذخیره نمی‌شوند.
- پروتکل‌های خطرناک مانند `javascript:` و `vbscript:` در لینک‌ها مجاز نیستند.
- attributeهای global style/id ذخیره نمی‌شوند تا محتوای خبر نتواند استایل‌های global سایت را مختل کند.
- سمت سرور منبع نهایی حقیقت است؛ HTML تولید شده در مرورگر برای ذخیره امن کافی محسوب نمی‌شود.

## Compatibility

- رکوردهای قدیمی که فقط `content` دارند همچنان نمایش داده می‌شوند.
- اگر `contentType` قدیمی برابر `MARKDOWN` باشد، مسیر legacy Markdown renderer حفظ می‌شود.
- برای رکوردهای جدید `contentType` برابر `HTML` است، اما Markdown خام در `content_markdown` باقی می‌ماند.
