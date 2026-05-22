/**
 * Markdown Processor Utility
 * Server and client-side markdown parsing and HTML generation with security
 */

import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Configuration for Markdown parsing
 */
const markedConfig = {
  breaks: true,
  gfm: true, // GitHub Flavored Markdown
  pedantic: false,
};

/**
 * HTML Sanitization configuration for DOMPurify
 */
const sanitizeConfig = {
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
 * Initialize marked configuration
 */
marked.setOptions(markedConfig);

/**
 * Parse Markdown to HTML with security
 * @param markdown - Raw markdown text
 * @returns Sanitized HTML string
 */
export function parseMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  try {
    // Parse markdown to HTML
    let html = marked(markdown);

    // Sanitize the HTML to prevent XSS
    const sanitized = DOMPurify.sanitize(html, sanitizeConfig);

    return sanitized;
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return '';
  }
}

/**
 * Validate markdown content
 * @param markdown - Markdown text to validate
 * @returns Validation result with error message if invalid
 */
export function validateMarkdown(markdown: string): { valid: boolean; error?: string } {
  if (!markdown) {
    return { valid: false, error: 'Content cannot be empty' };
  }

  if (typeof markdown !== 'string') {
    return { valid: false, error: 'Content must be a string' };
  }

  // Max size: 1MB
  if (markdown.length > 1048576) {
    return { valid: false, error: 'Content exceeds maximum size of 1MB' };
  }

  return { valid: true };
}

/**
 * Extract plain text from markdown
 * @param markdown - Markdown text
 * @returns Plain text version
 */
export function extractPlainText(markdown: string): string {
  if (!markdown) return '';

  // Remove markdown syntax
  let text = markdown
    // Remove headings
    .replace(/^#+\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*|__|\*|_|~~|`/g, '')
    // Remove links
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
    // Remove inline code backticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove line breaks and extra spaces
    .trim()
    .replace(/\s+/g, ' ');

  return text;
}

/**
 * Calculate reading time in minutes
 * @param markdown - Markdown content
 * @returns Reading time in minutes
 */
export function calculateReadingTime(markdown: string): number {
  const plainText = extractPlainText(markdown);
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  // Average reading speed: 200 words per minute
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Get word count from markdown
 * @param markdown - Markdown content
 * @returns Word count
 */
export function getWordCount(markdown: string): number {
  const plainText = extractPlainText(markdown);
  return plainText.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Generate excerpt from markdown
 * @param markdown - Markdown content
 * @param length - Maximum character length for excerpt
 * @returns Excerpt text
 */
export function generateExcerpt(markdown: string, length: number = 160): string {
  const plainText = extractPlainText(markdown);
  if (plainText.length <= length) return plainText;
  return plainText.substring(0, length).trim() + '...';
}

/**
 * Check if markdown content is safe (no dangerous elements after parsing)
 * @param markdown - Markdown text
 * @returns Boolean indicating if content is safe
 */
export function isMarkdownSafe(markdown: string): boolean {
  if (!markdown) return true;

  // Check for script tags or dangerous patterns
  const dangerousPatterns = [
    /<script/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /vbscript:/gi,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(markdown));
}

/**
 * Sanitize markdown content before processing
 * Removes or escapes potentially dangerous content at markdown level
 * @param markdown - Raw markdown content
 * @returns Sanitized markdown
 */
export function sanitizeMarkdown(markdown: string): string {
  if (!markdown) return '';

  let sanitized = markdown
    // Remove script tags
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    // Remove style tags
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
    // Remove dangerous protocols in markdown links
    .replace(/\[([^\]]+)\]\(javascript:[^\)]+\)/gi, '[$1](#)')
    .replace(/\[([^\]]+)\]\(data:[^\)]+\)/gi, '[$1](#)')
    // Remove iframes
    .replace(/!\[([^\]]*)\]\(.*iframe.*/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');

  return sanitized;
}
