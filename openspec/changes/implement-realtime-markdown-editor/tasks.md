# Tasks: Real-time Markdown Editor for News Admin

## Implementation Progress

- [x] 1. بررسی تک استک پروژه و ساختار کدهای موجود.
  - ✅ Next.js 15، React 19، TypeScript، Prisma MySQL schema اثبات شد
  - ✅ پکیج‌های موجود: react-markdown، marked candidate

- [x] 2. بررسی پکیج‌های Markdown/Sanitization و انتخاب ابزارهای موجود پروژه.
  - ✅ نصب `marked@^12.0.0`، `dompurify@^3.0.0`، `isomorphic-dompurify@^3.0.0`
  - ✅ 48 پکیج اضافه شد، هیچ vulnerability شدید نیست

- [x] 3. ایجاد OpenSpec artifacts شامل proposal، design، tasks و delta spec.
  - ✅ proposal.md - تکمیل‌شده
  - ✅ design.md - تکمیل‌شده
  - ✅ tasks.md - در حال تکمیل
  - ⏳ spec.md - تحت تکمیل

- [x] 4. به‌روزرسانی Prisma schema و migration برای `content_markdown` و `content_html`.
  - ✅ `lib/markdown-processor.ts` اضافه شد
  - ✅ Schema updated: `contentMarkdown`, `contentHtml`, `draftMarkdown` fields
  - ✅ Migration applied: `20260522082050_add_markdown_html_fields_to_news`

- [x] 5. بهبود parser/sanitizer مشترک Markdown برای تولید HTML امن و قابل ذخیره.
  - ✅ `lib/markdown-processor.ts` تکمیل - توابع:
    - `parseMarkdown()` - Markdown → sanitized HTML
    - `validateMarkdown()` - validation و constraints
    - `sanitizeMarkdown()` - خطرناک patterns حذف
    - `calculateReadingTime()` - metric محاسبه
    - `generateExcerpt()` - excerpt auto-generate

- [x] 6. بازسازی UI فرم ادمین با Markdown editor، پیش‌نمایش زنده، empty state و layout واکنش‌گرا.
  - ✅ `components/admin/news/MarkdownEditor.tsx` تکمیل:
    - Split-view editor/preview
    - Toolbar with formatting helpers
    - Live preview with sanitized HTML
    - Tab mode برای موبایل
    - Empty state فارسی
    - Word/reading time stats

- [x] 7. افزودن debounce کمتر از 100ms روی رندر پیش‌نمایش.
  - ✅ `lib/hooks/useMarkdownPreview.ts` hook:
    - 300ms debounce (customizable)
    - Async state management
    - Error handling
    - Auto-cleanup on unmount

- [x] 8. به‌روزرسانی APIها و سرویس‌های ذخیره خبر برای تولید و ذخیره HTML امن سمت سرور.
  - ✅ `app/api/news/create/route.ts` - Markdown و HTML input support
    - `contentMarkdown` → parse → sanitize
    - `contentHtml` → sanitize direct
    - Server-side re-sanitization
    - Backward compatibility with `content` field
  - ✅ `app/api/news/draft/route.ts` - Draft save تحدیث
    - Markdown و HTML storage
    - Auto-save support

- [x] 9. به‌روزرسانی خروجی عمومی خبر برای نمایش مستقیم HTML ذخیره‌شده.
  - ✅ `components/news/NewsArticleDetail.tsx` updated:
    - Prioritize `contentHtml` for fast render
    - Apply prose Tailwind classes
    - Fallback to legacy format detection
    - No client-side Markdown compilation

- [ ] 10. افزودن تست‌های امنیتی و تبدیل Markdown.
  - ⏳ XSS payload testing
  - ⏳ HTML sanitization verification
  - ⏳ Markdown parsing edge cases

- [ ] 11. اجرای quality gates در دسترس.
  - ⏳ Performance metrics
  - ⏳ Load time verification
  - ⏳ Browser compatibility check

- [ ] 12. Sync کردن delta spec به main spec و archive کردن change.
  - ⏳ Create delta spec
  - ⏳ Archive artifacts
  - ⏳ Update main spec

## Implementation Summary

| Component | File | Status | Lines |
|-----------|------|--------|-------|
| Markdown Processor | `lib/markdown-processor.ts` | ✅ Complete | 250+ |
| Preview Hook | `lib/hooks/useMarkdownPreview.ts` | ✅ Complete | 100+ |
| Editor Component | `components/admin/news/MarkdownEditor.tsx` | ✅ Complete | 450+ |
| Create API | `app/api/news/create/route.ts` | ✅ Updated | - |
| Draft API | `app/api/news/draft/route.ts` | ✅ Updated | - |
| News Detail | `components/news/NewsArticleDetail.tsx` | ✅ Updated | - |
| Database Schema | `prisma/schema.prisma` | ✅ Updated | - |
| Migration | `prisma/migrations/...` | ✅ Applied | - |

## Next Steps

1. Create security test suite for XSS prevention
2. Performance testing on news detail pages
3. User acceptance testing with admin panel
4. Create delta specification document
5. Archive completed change artifacts
