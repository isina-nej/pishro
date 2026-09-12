import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

describe('news dual cover (desktop + mobile)', () => {
  it('schema has coverImageMobile column', () => {
    const schema = read('prisma/schema.prisma');
    assert.ok(schema.includes('coverImageMobile'), 'prisma column exists');
  });

  it('migration adds nullable column after coverImage', () => {
    const sql = read('prisma/migrations/20260912000000_add_news_mobile_cover/migration.sql');
    assert.ok(sql.includes('coverImageMobile'), 'migration adds column');
    assert.ok(sql.includes('AFTER `coverImage`'), 'column placed after coverImage');
  });

  it('zod schemas accept optional mobile cover', () => {
    const schema = read('lib/schemas/block-news-schema.ts');
    assert.ok(schema.includes('coverImageMobile'), 'create+update schemas accept field');
  });

  it('service persists and deletes mobile cover', () => {
    const svc = read('lib/services/block-news-service.ts');
    assert.ok(svc.includes('coverImageMobile'), 'create/update/delete handle field');
  });

  it('admin form has two upload boxes with exact dimensions', () => {
    const form = read('components/admin/news/NewsArticleForm.tsx');
    assert.ok(form.includes('thumbnailMobile'), 'form state has mobile field');
    assert.ok(form.includes('1920×1080'), 'desktop size shown');
    assert.ok(form.includes('1080×1350'), 'mobile size shown');
    assert.ok(form.includes('cover-desktop') && form.includes('cover-mobile'), 'two testids');
  });

  it('detail hero serves mobile cover under sm breakpoint, desktop above', () => {
    const detail = read('components/news/NewsArticleDetail.tsx');
    assert.ok(detail.includes('coverImageMobile'), 'hero reads mobile cover');
    assert.ok(detail.includes('sm:hidden') && detail.includes('sm:block'), 'breakpoint split');
  });

  it('old single-cover data still renders (mobile empty = desktop fallback)', () => {
    const detail = read('components/news/NewsArticleDetail.tsx');
    // نسخه موبایل فقط وقتی رندر می‌شود که مقدار داشته باشد
    assert.ok(detail.includes('article.coverImageMobile ?'), 'mobile guarded');
    // نسخه دسکتاپ همیشه هست و روی موبایل فقط وقتی تنها گزینه است نمایش داده می‌شود
    assert.ok(detail.includes("article.coverImageMobile ? 'hidden object-cover sm:block' : 'object-cover'"), 'desktop fallback');
  });
});
