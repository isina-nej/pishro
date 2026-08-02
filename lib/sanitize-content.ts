/**
 * Sanitize Content Utility
 * Server-side HTML content sanitization for XSS prevention
 *
 * پاک‌سازی روی DOMPurify انجام می‌شود (allow-list واقعی، نه regex).
 */

import DOMPurify from 'isomorphic-dompurify';

export interface SanitizationOptions {
  /** Overrides the default tag allow-list entirely. */
  allowedTags?: string[];
  /**
   * Overrides the default attribute allow-list entirely.
   * DOMPurify applies attributes globally, so this is a flat list —
   * it cannot express per-tag rules.
   */
  allowedAttributes?: string[];
}

/**
 * Shared DOMPurify allow-list for every user-supplied HTML path in the app:
 * editor/article HTML here, and rendered markdown in `lib/markdown-processor.ts`.
 *
 * تنها منبع حقیقت برای تگ‌ها و ویژگی‌های مجاز — کپی نکنید، از همین‌جا import کنید.
 */
export const HTML_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'del',
    'blockquote', 'ul', 'ol', 'li',
    'pre', 'code', 'hr', 'br',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel',
    'src', 'alt', 'width', 'height',
    'class', 'id', 'style',
    'colspan', 'rowspan',
    'align', 'valign',
  ],
  KEEP_CONTENT: true,
};

/**
 * Build the DOMPurify config for a call, applying any caller overrides.
 */
function resolveConfig(options?: SanitizationOptions) {
  if (!options?.allowedTags && !options?.allowedAttributes) {
    return HTML_SANITIZE_CONFIG;
  }

  return {
    ...HTML_SANITIZE_CONFIG,
    ...(options.allowedTags ? { ALLOWED_TAGS: options.allowedTags } : {}),
    ...(options.allowedAttributes ? { ALLOWED_ATTR: options.allowedAttributes } : {}),
  };
}

/**
 * HTML content sanitization to prevent XSS attacks
 *
 * Delegates to DOMPurify with the shared allow-list: anything outside
 * `HTML_SANITIZE_CONFIG` is dropped (text content of unknown tags is kept,
 * per `KEEP_CONTENT`), including scripts, event handlers and unsafe URL schemes.
 */
export function sanitizeContent(
  html: string,
  options?: SanitizationOptions
): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    return DOMPurify.sanitize(html, resolveConfig(options));
  } catch (error) {
    console.error('Sanitization error:', error);
    return '';
  }
}

/**
 * Check if HTML content is safe, i.e. sanitizing it would not change it.
 *
 * Conservative by design: markup that is merely *normalized* by the sanitizer
 * (unquoted attributes, unclosed tags, tags outside the allow-list) also
 * reports `false`. A `true` result means the content can be stored/rendered
 * exactly as-is; it never returns `true` for content DOMPurify would strip.
 */
export function isContentSafe(html: string): boolean {
  if (!html) return true;

  return sanitizeContent(html) === html;
}

/**
 * Get word count from HTML content
 */
export function getWordCount(html: string): number {
  if (!html) return 0;

  // Replace tags with a space so adjacent tags don't fuse two words together
  // (`<p>Hello</p><b>world</b>` is two words, not "Helloworld")
  const text = html.replace(/<[^>]*>/g, ' ');

  // Remove extra whitespace
  const cleaned = text.trim().replace(/\s+/g, ' ');

  // Count words
  return cleaned.length === 0 ? 0 : cleaned.split(' ').length;
}

/**
 * Get character count from HTML content (excluding tags)
 */
export function getCharacterCount(html: string): number {
  if (!html) return 0;

  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');

  // Return character count
  return text.length;
}

/**
 * Extract plain text from HTML content
 */
export function extractPlainText(html: string): string {
  if (!html) return '';

  // Replace tags with a space so adjacent tags don't fuse two words together
  // (collapsed again below by the whitespace pass)
  let text = html.replace(/<[^>]*>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Remove extra whitespace
  text = text.trim().replace(/\s+/g, ' ');

  return text;
}
