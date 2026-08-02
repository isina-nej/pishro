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
} from '@/lib/sanitize-content';

/** assert that `haystack` contains `needle`, with a readable failure message */
function assertContains(haystack: string, needle: string) {
  assert.ok(
    haystack.includes(needle),
    `expected ${JSON.stringify(haystack)} to contain ${JSON.stringify(needle)}`
  );
}

/** assert that `haystack` does NOT contain `needle`, with a readable failure message */
function assertNotContains(haystack: string, needle: string) {
  assert.ok(
    !haystack.includes(needle),
    `expected ${JSON.stringify(haystack)} not to contain ${JSON.stringify(needle)}`
  );
}

describe('Sanitization Service', () => {
  describe('sanitizeContent()', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Safe <strong>content</strong></p>';
      const output = sanitizeContent(input);
      assertContains(output, 'Safe');
      assertContains(output, 'content');
    });

    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("xss")</script>';
      const output = sanitizeContent(input);
      assertNotContains(output, 'script');
      assertNotContains(output, 'alert');
    });

    it('should remove event handlers', () => {
      const input = '<p onclick="alert(1)">Click me</p>';
      const output = sanitizeContent(input);
      assertNotContains(output, 'onclick');
      assertNotContains(output, 'alert');
    });

    it('should allow links with safe attributes', () => {
      const input = '<a href="https://example.com">Link</a>';
      const output = sanitizeContent(input);
      assertContains(output, 'href');
      assertContains(output, 'example.com');
    });

    it('should remove javascript: protocol in links', () => {
      const input = '<a href="javascript:alert(1)">Click</a>';
      const output = sanitizeContent(input);
      assertNotContains(output, 'javascript:');
    });

    it('should allow images with safe attributes', () => {
      const input = '<img src="image.jpg" alt="Test">';
      const output = sanitizeContent(input);
      assertContains(output, 'img');
      assertContains(output, 'image.jpg');
    });

    it('should remove iframe tags', () => {
      const input = '<iframe src="malicious.com"></iframe>';
      const output = sanitizeContent(input);
      assertNotContains(output, 'iframe');
    });

    it('should handle empty input', () => {
      const output = sanitizeContent('');
      assert.equal(output, '');
    });

    it('should handle null/undefined gracefully', () => {
      assert.equal(sanitizeContent(null as any), '');
      assert.equal(sanitizeContent(undefined as any), '');
    });

    it('should preserve heading hierarchy', () => {
      const input = '<h1>Title</h1><h2>Subtitle</h2><p>Content</p>';
      const output = sanitizeContent(input);
      assertContains(output, 'h1');
      assertContains(output, 'h2');
      assertContains(output, 'Title');
      assertContains(output, 'Subtitle');
    });

    it('should allow code blocks with classes', () => {
      const input = '<pre><code class="language-javascript">const x = 1;</code></pre>';
      const output = sanitizeContent(input);
      assertContains(output, 'code');
      assertContains(output, 'javascript');
    });
  });

  describe('isContentSafe()', () => {
    it('should return true for safe content', () => {
      const content = '<p>Safe content</p>';
      assert.equal(isContentSafe(content), true);
    });

    it('should return false for content with scripts', () => {
      const content = '<script>alert("xss")</script>';
      assert.equal(isContentSafe(content), false);
    });

    it('should return false for content with event handlers', () => {
      const content = '<p onclick="alert(1)">Click</p>';
      assert.equal(isContentSafe(content), false);
    });

    it('should return false for iframes', () => {
      const content = '<iframe src="bad.com"></iframe>';
      assert.equal(isContentSafe(content), false);
    });

    it('should return false for javascript: protocol', () => {
      const content = '<a href="javascript:void(0)">Click</a>';
      assert.equal(isContentSafe(content), false);
    });

    it('should return true for empty content', () => {
      assert.equal(isContentSafe(''), true);
    });
  });

  describe('getWordCount()', () => {
    it('should count words correctly', () => {
      const content = '<p>Hello world test</p>';
      assert.equal(getWordCount(content), 3);
    });

    it('should ignore HTML tags in count', () => {
      const content = '<p>Hello</p><strong>world</strong>';
      assert.equal(getWordCount(content), 2);
    });

    it('should return 0 for empty content', () => {
      assert.equal(getWordCount(''), 0);
      assert.equal(getWordCount('<p></p>'), 0);
    });

    it('should handle multiple spaces', () => {
      const content = '<p>Hello   world   test</p>';
      assert.equal(getWordCount(content), 3);
    });
  });

  describe('getCharacterCount()', () => {
    it('should count characters correctly', () => {
      const content = '<p>Hello</p>';
      assert.equal(getCharacterCount(content), 5);
    });

    it('should ignore HTML tags', () => {
      const content = '<p><strong>Hello</strong></p>';
      assert.equal(getCharacterCount(content), 5);
    });

    it('should return 0 for empty content', () => {
      assert.equal(getCharacterCount(''), 0);
      assert.equal(getCharacterCount('<p></p>'), 0);
    });
  });

  describe('extractPlainText()', () => {
    it('should extract plain text from HTML', () => {
      const content = '<p>Hello <strong>world</strong></p>';
      const text = extractPlainText(content);
      assert.equal(text, 'Hello world');
    });

    it('should decode HTML entities', () => {
      const content = '<p>Hello &amp; goodbye</p>';
      const text = extractPlainText(content);
      assertContains(text, '&');
    });

    it('should handle multiple tags', () => {
      const content = '<h1>Title</h1><p>Paragraph</p>';
      const text = extractPlainText(content);
      assertContains(text, 'Title');
      assertContains(text, 'Paragraph');
    });

    it('should return empty string for empty input', () => {
      assert.equal(extractPlainText(''), '');
      assert.equal(extractPlainText('<p></p>'), '');
    });
  });
});
