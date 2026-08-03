/**
 * Unit Tests for sanitize-content.ts
 * Testing XSS protection and HTML sanitization
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeContent,
  isContentSafe,
  getWordCount,
  getCharacterCount,
  extractPlainText,
  HTML_SANITIZE_CONFIG,
} from '@/lib/sanitize-content';
import { parseMarkdown } from '@/lib/markdown-processor';

describe('Sanitization Service', () => {
  describe('sanitizeContent()', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Safe <strong>content</strong></p>';
      assert.equal(sanitizeContent(input), input);
    });

    it('should remove script tags', () => {
      const output = sanitizeContent('<p>Hello</p><script>alert("xss")</script>');
      assert.equal(output, '<p>Hello</p>');
    });

    it('should remove event handlers', () => {
      const output = sanitizeContent('<p onclick="alert(1)">Click me</p>');
      assert.equal(output, '<p>Click me</p>');
    });

    it('should allow links with safe attributes', () => {
      const input = '<a href="https://example.com">Link</a>';
      assert.equal(sanitizeContent(input), input);
    });

    it('should remove javascript: protocol in links', () => {
      const output = sanitizeContent('<a href="javascript:alert(1)">Click</a>');
      assert.equal(output, '<a>Click</a>');
      assert.ok(!output.includes('javascript:'));
    });

    it('should allow images with safe attributes', () => {
      const input = '<img src="image.jpg" alt="Test">';
      assert.equal(sanitizeContent(input), input);
    });

    it('should remove iframe tags', () => {
      const output = sanitizeContent('<iframe src="malicious.com"></iframe>');
      assert.equal(output, '');
    });

    it('should handle empty input', () => {
      assert.equal(sanitizeContent(''), '');
    });

    it('should handle null/undefined gracefully', () => {
      assert.equal(sanitizeContent(null as unknown as string), '');
      assert.equal(sanitizeContent(undefined as unknown as string), '');
    });

    it('should preserve heading hierarchy', () => {
      const input = '<h1>Title</h1><h2>Subtitle</h2><p>Content</p>';
      assert.equal(sanitizeContent(input), input);
    });

    it('should allow code blocks with classes', () => {
      const input = '<pre><code class="language-javascript">const x = 1;</code></pre>';
      assert.equal(sanitizeContent(input), input);
    });

    it('should strip style tags but keep surrounding content', () => {
      assert.equal(sanitizeContent('<style>body{color:red}</style><p>hi</p>'), '<p>hi</p>');
    });

    it('should unwrap tags outside the allow-list but keep their text', () => {
      assert.equal(sanitizeContent('<div>hello</div>'), 'hello');
    });
  });

  /**
   * Vectors below all defeated the previous regex-based sanitizer.
   * They are the reason this module delegates to DOMPurify — keep them passing.
   */
  describe('sanitizeContent() — XSS vectors that bypassed the regex sanitizer', () => {
    it('should strip event handlers written without quotes', () => {
      assert.equal(sanitizeContent('<img src=x onerror=alert(1)>'), '<img src="x">');
      assert.equal(sanitizeContent('<p onclick=alert(1)>x</p>'), '<p>x</p>');
    });

    it('should not leave a live script tag after nested-tag smuggling', () => {
      const output = sanitizeContent('<scr<script>ipt>alert(1)</script>');
      assert.ok(!output.includes('<script'));
      assert.ok(!output.includes('<scr'));
    });

    it('should strip entity-encoded javascript: URLs', () => {
      assert.equal(sanitizeContent('<a href="jav&#x61;script:alert(1)">click</a>'), '<a>click</a>');
      assert.equal(sanitizeContent('<a href = "javascript&colon;alert(1)">x</a>'), '<a>x</a>');
    });

    it('should strip SVG animation handlers', () => {
      assert.equal(sanitizeContent('<svg><animate onbegin=alert(1) attributeName=x dur=1s>'), '');
    });

    it('should strip mXSS namespace-confusion payloads', () => {
      const output = sanitizeContent('<math><mtext><table><mglyph><style><img src=x onerror=alert(1)>');
      assert.equal(output, '');
    });

    it('should strip data: URLs on anchors', () => {
      const output = sanitizeContent('<a href="data:text/html,<script>alert(1)</script>">x</a>');
      assert.ok(!output.includes('data:'));
      assert.ok(!output.includes('<script'));
    });
  });

  describe('sanitizeContent() — production call-site shapes', () => {
    // app/api/news/create/route.ts:76,:80 — Tiptap output from lib/editor-extensions.ts
    it('should pass editor output through unchanged', () => {
      const input =
        '<h1>Title</h1><p>Text with <strong>bold</strong> and <em>italic</em> and <code>code</code>.</p>' +
        '<ul><li>item</li></ul><ol class="ordered-list"><li>item</li></ol>' +
        '<blockquote><p>quote</p></blockquote><pre><code>const x = 1;</code></pre><hr><p>line<br>next</p>' +
        '<a class="editor-link" rel="noopener noreferrer nofollow" target="_blank" href="https://example.com">link</a>' +
        '<img class="editor-image" src="/uploads/x.jpg" alt="image">';
      assert.equal(sanitizeContent(input), input);
    });

    // Image.configure({ allowBase64: true }) — the regex sanitizer used to blank these out
    it('should preserve base64 inline images', () => {
      const input = '<img class="editor-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==" alt="inline">';
      assert.equal(sanitizeContent(input), input);
    });

    // scripts/migrate-article-content.ts:83 — output of plainTextToHtml()
    it('should pass migrated plain-text paragraphs through unchanged', () => {
      const input = '<p>first line<br>second line</p><p>second paragraph</p>';
      assert.equal(sanitizeContent(input), input);
    });

    it('should strip XSS smuggled through migrated plain text', () => {
      const output = sanitizeContent('<p>hi <script>alert(1)</script></p><p><img src=x onerror=alert(1)></p>');
      assert.equal(output, '<p>hi </p><p><img src="x"></p>');
    });
  });

  describe('sanitizeContent() — options overrides', () => {
    it('should honour a custom tag allow-list', () => {
      assert.equal(
        sanitizeContent('<p>a</p><strong>b</strong>', { allowedTags: ['strong'] }),
        'a<strong>b</strong>'
      );
    });

    it('should honour a custom attribute allow-list', () => {
      assert.equal(
        sanitizeContent('<a href="https://x.com" class="c" id="i">L</a>', { allowedAttributes: ['href'] }),
        '<a href="https://x.com">L</a>'
      );
    });

    it('should fall back to the shared config when no overrides are given', () => {
      assert.equal(sanitizeContent('<a href="https://x.com" class="c">L</a>'), '<a href="https://x.com" class="c">L</a>');
      assert.equal(sanitizeContent('<p>x</p>', {}), '<p>x</p>');
    });
  });

  describe('HTML_SANITIZE_CONFIG (shared with markdown-processor)', () => {
    it('should be the single allow-list used by both HTML and markdown paths', () => {
      // h4-h6 and tables come from the shared list; the old local list lacked them.
      assert.ok(HTML_SANITIZE_CONFIG.ALLOWED_TAGS.includes('h4'));
      assert.ok(HTML_SANITIZE_CONFIG.ALLOWED_TAGS.includes('table'));
      assert.equal(sanitizeContent('<h4>a</h4><h5>b</h5><h6>c</h6>'), '<h4>a</h4><h5>b</h5><h6>c</h6>');
      assert.equal(
        sanitizeContent('<table><tbody><tr><td>1</td></tr></tbody></table>'),
        '<table><tbody><tr><td>1</td></tr></tbody></table>'
      );
    });

    it('should keep markdown rendering working off the same config', () => {
      const html = parseMarkdown('# Title\n\n**bold** [link](https://x.com)');
      assert.ok(html.includes('<h1>Title</h1>'));
      assert.ok(html.includes('<strong>bold</strong>'));
      assert.ok(html.includes('<a href="https://x.com">link</a>'));

      const xss = parseMarkdown('[click](javascript:alert(1))\n\n<script>alert(1)</script>');
      assert.ok(!xss.includes('javascript:'));
      assert.ok(!xss.includes('<script'));
    });
  });

  describe('isContentSafe()', () => {
    it('should return true for safe content', () => {
      assert.equal(isContentSafe('<p>Safe content</p>'), true);
    });

    it('should return false for content with scripts', () => {
      assert.equal(isContentSafe('<script>alert("xss")</script>'), false);
    });

    it('should return false for content with event handlers', () => {
      assert.equal(isContentSafe('<p onclick="alert(1)">Click</p>'), false);
    });

    it('should return false for iframes', () => {
      assert.equal(isContentSafe('<iframe src="bad.com"></iframe>'), false);
    });

    it('should return false for javascript: protocol', () => {
      assert.equal(isContentSafe('<a href="javascript:void(0)">Click</a>'), false);
    });

    it('should return true for empty content', () => {
      assert.equal(isContentSafe(''), true);
    });

    it('should return false for markup the sanitizer would rewrite', () => {
      // Conservative by design: normalization counts as "not safe as-is".
      assert.equal(isContentSafe('<img src=x>'), false);
      assert.equal(isContentSafe('<div>hello</div>'), false);
    });
  });

  describe('getWordCount()', () => {
    it('should count words correctly', () => {
      assert.equal(getWordCount('<p>Hello world test</p>'), 3);
    });

    it('should ignore HTML tags in count', () => {
      assert.equal(getWordCount('<p>Hello</p><strong>world</strong>'), 2);
    });

    it('should return 0 for empty content', () => {
      assert.equal(getWordCount(''), 0);
      assert.equal(getWordCount('<p></p>'), 0);
    });

    it('should handle multiple spaces', () => {
      assert.equal(getWordCount('<p>Hello   world   test</p>'), 3);
    });
  });

  describe('getCharacterCount()', () => {
    it('should count characters correctly', () => {
      assert.equal(getCharacterCount('<p>Hello</p>'), 5);
    });

    it('should ignore HTML tags', () => {
      assert.equal(getCharacterCount('<p><strong>Hello</strong></p>'), 5);
    });

    it('should return 0 for empty content', () => {
      assert.equal(getCharacterCount(''), 0);
      assert.equal(getCharacterCount('<p></p>'), 0);
    });
  });

  describe('extractPlainText()', () => {
    it('should extract plain text from HTML', () => {
      assert.equal(extractPlainText('<p>Hello <strong>world</strong></p>'), 'Hello world');
    });

    it('should decode HTML entities', () => {
      assert.ok(extractPlainText('<p>Hello &amp; goodbye</p>').includes('&'));
    });

    it('should handle multiple tags', () => {
      // adjacent tags must not fuse into "TitleParagraph"
      assert.equal(extractPlainText('<h1>Title</h1><p>Paragraph</p>'), 'Title Paragraph');
    });

    it('should return empty string for empty input', () => {
      assert.equal(extractPlainText(''), '');
      assert.equal(extractPlainText('<p></p>'), '');
    });
  });
});
