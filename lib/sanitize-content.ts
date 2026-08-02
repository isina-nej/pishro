/**
 * Sanitize Content Utility
 * Server-side HTML content sanitization for XSS prevention
 */

/**
 * Basic HTML content sanitization to prevent XSS attacks
 * Removes dangerous scripts and event handlers
 *
 * NOTE: this is a deny-list regex sanitizer and is inherently bypassable.
 * For new code paths that render user-supplied HTML, use `isomorphic-dompurify`
 * (see `lib/markdown-processor.ts`) instead of this function.
 */
export function sanitizeContent(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    let sanitized = html;

    // Remove script tags and content
    sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // Remove style tags and content
    sanitized = sanitized.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Remove event handlers (onclick, onload, etc.)
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove dangerous protocols in href and src
    sanitized = sanitized.replace(/href\s*=\s*["']?javascript:/gi, 'href="#"');
    sanitized = sanitized.replace(/href\s*=\s*["']?data:/gi, 'href="#"');
    sanitized = sanitized.replace(/src\s*=\s*["']?javascript:/gi, 'src=""');
    sanitized = sanitized.replace(/src\s*=\s*["']?data:/gi, 'src=""');

    // Remove iframes
    sanitized = sanitized.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');

    return sanitized;
  } catch (error) {
    console.error('Sanitization error:', error);
    return '';
  }
}

/**
 * Check if HTML content is safe (no scripts, event handlers, etc.)
 */
export function isContentSafe(html: string): boolean {
  if (!html) return true;

  // Check for script tags
  if (/<script[^>]*>[\s\S]*?<\/script>/gi.test(html)) {
    return false;
  }

  // Check for event handlers
  if (/on\w+\s*=/gi.test(html)) {
    return false;
  }

  // Check for iframes
  if (/<iframe/gi.test(html)) {
    return false;
  }

  // Check for dangerous protocols
  if (/javascript:|data:|vbscript:/gi.test(html)) {
    return false;
  }

  return true;
}

/**
 * Get word count from HTML content
 */
export function getWordCount(html: string): number {
  if (!html) return 0;

  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');

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

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');

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
