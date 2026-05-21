/**
 * Unit Tests for sanitize-content.ts
 * Testing XSS protection and HTML sanitization
 */

import {
  sanitizeContent,
  isContentSafe,
  getWordCount,
  getCharacterCount,
  extractPlainText,
} from '@/lib/sanitize-content';

describe('Sanitization Service', () => {
  describe('sanitizeContent()', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Safe <strong>content</strong></p>';
      const output = sanitizeContent(input);
      expect(output).toContain('Safe');
      expect(output).toContain('content');
    });

    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("xss")</script>';
      const output = sanitizeContent(input);
      expect(output).not.toContain('script');
      expect(output).not.toContain('alert');
    });

    it('should remove event handlers', () => {
      const input = '<p onclick="alert(1)">Click me</p>';
      const output = sanitizeContent(input);
      expect(output).not.toContain('onclick');
      expect(output).not.toContain('alert');
    });

    it('should allow links with safe attributes', () => {
      const input = '<a href="https://example.com">Link</a>';
      const output = sanitizeContent(input);
      expect(output).toContain('href');
      expect(output).toContain('example.com');
    });

    it('should remove javascript: protocol in links', () => {
      const input = '<a href="javascript:alert(1)">Click</a>';
      const output = sanitizeContent(input);
      expect(output).not.toContain('javascript:');
    });

    it('should allow images with safe attributes', () => {
      const input = '<img src="image.jpg" alt="Test">';
      const output = sanitizeContent(input);
      expect(output).toContain('img');
      expect(output).toContain('image.jpg');
    });

    it('should remove iframe tags', () => {
      const input = '<iframe src="malicious.com"></iframe>';
      const output = sanitizeContent(input);
      expect(output).not.toContain('iframe');
    });

    it('should handle empty input', () => {
      const output = sanitizeContent('');
      expect(output).toBe('');
    });

    it('should handle null/undefined gracefully', () => {
      expect(sanitizeContent(null as any)).toBe('');
      expect(sanitizeContent(undefined as any)).toBe('');
    });

    it('should preserve heading hierarchy', () => {
      const input = '<h1>Title</h1><h2>Subtitle</h2><p>Content</p>';
      const output = sanitizeContent(input);
      expect(output).toContain('h1');
      expect(output).toContain('h2');
      expect(output).toContain('Title');
      expect(output).toContain('Subtitle');
    });

    it('should allow code blocks with classes', () => {
      const input = '<pre><code class="language-javascript">const x = 1;</code></pre>';
      const output = sanitizeContent(input);
      expect(output).toContain('code');
      expect(output).toContain('javascript');
    });
  });

  describe('isContentSafe()', () => {
    it('should return true for safe content', () => {
      const content = '<p>Safe content</p>';
      expect(isContentSafe(content)).toBe(true);
    });

    it('should return false for content with scripts', () => {
      const content = '<script>alert("xss")</script>';
      expect(isContentSafe(content)).toBe(false);
    });

    it('should return false for content with event handlers', () => {
      const content = '<p onclick="alert(1)">Click</p>';
      expect(isContentSafe(content)).toBe(false);
    });

    it('should return false for iframes', () => {
      const content = '<iframe src="bad.com"></iframe>';
      expect(isContentSafe(content)).toBe(false);
    });

    it('should return false for javascript: protocol', () => {
      const content = '<a href="javascript:void(0)">Click</a>';
      expect(isContentSafe(content)).toBe(false);
    });

    it('should return true for empty content', () => {
      expect(isContentSafe('')).toBe(true);
    });
  });

  describe('getWordCount()', () => {
    it('should count words correctly', () => {
      const content = '<p>Hello world test</p>';
      expect(getWordCount(content)).toBe(3);
    });

    it('should ignore HTML tags in count', () => {
      const content = '<p>Hello</p><strong>world</strong>';
      expect(getWordCount(content)).toBe(2);
    });

    it('should return 0 for empty content', () => {
      expect(getWordCount('')).toBe(0);
      expect(getWordCount('<p></p>')).toBe(0);
    });

    it('should handle multiple spaces', () => {
      const content = '<p>Hello   world   test</p>';
      expect(getWordCount(content)).toBe(3);
    });
  });

  describe('getCharacterCount()', () => {
    it('should count characters correctly', () => {
      const content = '<p>Hello</p>';
      expect(getCharacterCount(content)).toBe(5);
    });

    it('should ignore HTML tags', () => {
      const content = '<p><strong>Hello</strong></p>';
      expect(getCharacterCount(content)).toBe(5);
    });

    it('should return 0 for empty content', () => {
      expect(getCharacterCount('')).toBe(0);
      expect(getCharacterCount('<p></p>')).toBe(0);
    });
  });

  describe('extractPlainText()', () => {
    it('should extract plain text from HTML', () => {
      const content = '<p>Hello <strong>world</strong></p>';
      const text = extractPlainText(content);
      expect(text).toBe('Hello world');
    });

    it('should decode HTML entities', () => {
      const content = '<p>Hello &amp; goodbye</p>';
      const text = extractPlainText(content);
      expect(text).toContain('&');
    });

    it('should handle multiple tags', () => {
      const content = '<h1>Title</h1><p>Paragraph</p>';
      const text = extractPlainText(content);
      expect(text).toContain('Title');
      expect(text).toContain('Paragraph');
    });

    it('should return empty string for empty input', () => {
      expect(extractPlainText('')).toBe('');
      expect(extractPlainText('<p></p>')).toBe('');
    });
  });
});
