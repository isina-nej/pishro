'use server';

/**
 * Sanitize Content Utility
 * Server-side HTML content sanitization for XSS prevention
 */

import sanitizeHtml from 'sanitize-html';

export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
}

const DEFAULT_ALLOWED_TAGS = [
  'p',
  'h1',
  'h2',
  'h3',
  'blockquote',
  'ul',
  'ol',
  'li',
  'pre',
  'hr',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'del',
  'a',
  'code',
  'br',
  'img',
];

const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height', 'title'],
  h1: ['id'],
  h2: ['id'],
  h3: ['id'],
  pre: ['class'],
  code: ['class'],
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses whitelist approach for maximum security
 */
export function sanitizeContent(
  html: string,
  options?: SanitizationOptions
): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const allowedTags = options?.allowedTags || DEFAULT_ALLOWED_TAGS;
  const allowedAttributes = options?.allowedAttributes || DEFAULT_ALLOWED_ATTRIBUTES;

  try {
    return sanitizeHtml(html, {
      allowedTags,
      allowedAttributes,
      disallowedTagsMode: 'discard',
      enforceHtmlBoundary: true,
      transformTags: {
        a: sanitizeHtml.simpleTransform('a', {
          rel: 'noopener noreferrer nofollow',
        }),
      },
    });
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
