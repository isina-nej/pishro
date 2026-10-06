import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

describe('article heading typography', () => {
  it('uses a bounded responsive scale in every article renderer', () => {
    const detail = read('components/news/NewsArticleDetail.tsx');
    const markdown = read('components/BlockNews/MarkdownPreview.tsx');
    const globalStyles = read('app/styles/globals.css');

    assert.ok(detail.includes('text-2xl font-extrabold leading-[1.55]') && detail.includes('sm:text-3xl'));
    assert.ok(detail.includes('article-content'));
    assert.ok(detail.includes('[&_h2]:text-xl') && detail.includes('sm:[&_h2]:text-2xl'));
    assert.ok(markdown.includes('text-xl font-bold') && markdown.includes('sm:text-2xl'));
    assert.ok(globalStyles.includes('font-size: clamp(1.25rem, 1.08rem + 0.8vw, 1.75rem);'));
    assert.ok(!detail.includes('[&_h2]:text-3xl') && !markdown.includes('text-3xl'));
  });
});
