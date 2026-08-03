/**
 * MDXEditor Configuration and Utilities
 * Location: lib/utils/mdx-editor-utils.ts
 */

/**
 * Convert HTML to Markdown
 * Useful for migrating from TipTap editor content
 */
export function htmlToMarkdown(html: string): string {
  let markdown = html;

  // Headings
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

  // Paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

  // Bold
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

  // Italic
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Links
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Images
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

  // Line breaks
  markdown = markdown.replace(/<br[^>]*>/gi, '\n');

  // Horizontal line
  markdown = markdown.replace(/<hr[^>]*>/gi, '\n---\n');

  // Lists
  markdown = markdown.replace(/<ul[^>]*>/gi, '');
  markdown = markdown.replace(/<\/ul>/gi, '');
  markdown = markdown.replace(/<li[^>]*>/gi, '- ');
  markdown = markdown.replace(/<\/li>/gi, '\n');

  // Ordered lists
  markdown = markdown.replace(/<ol[^>]*>/gi, '');
  markdown = markdown.replace(/<\/ol>/gi, '');
  markdown = markdown.replace(/<li[^>]*>/gi, '1. ');

  // Code blocks
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n');
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');

  // Tables (basic)
  markdown = markdown.replace(/<table[^>]*>.*?<\/table>/gi, (match) => {
    const rows = match.match(/<tr[^>]*>(.*?)<\/tr>/gi) || [];
    return rows.map((row) => {
      const cells = row.match(/<t[dh][^>]*>(.*?)<\/t[dh]>/gi) || [];
      return cells.map((cell) => cell.replace(/<t[dh][^>]*>(.*?)<\/t[dh]>/i, '$1')).join(' | ') + '\n';
    }).join('');
  });

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]*>/g, '');

  // Clean up excessive newlines
  markdown = markdown.replace(/\n\n\n+/g, '\n\n');

  // Trim
  markdown = markdown.trim();

  return markdown;
}

/**
 * Sanitize markdown for security
 */
export function sanitizeMarkdown(markdown: string): string {
  // Remove potentially dangerous script patterns
  let sanitized = markdown;

  // Remove script tags and content
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove event handlers from HTML
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove iframes (except from trusted sources)
  sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');

  return sanitized;
}

/**
 * Extract text content from markdown (for preview/excerpt)
 */
export function extractTextFromMarkdown(markdown: string, maxLength = 160): string {
  // Remove markdown syntax
  let text = markdown
    .replace(/[#*`>\-_\[\]()]/g, '') // Remove markdown symbols
    .replace(/\n+/g, ' ') // Replace newlines with space
    .trim();

  // Truncate to maxLength
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + '...';
  }

  return text;
}

/**
 * Calculate reading time from markdown content
 */
export function calculateReadingTime(markdown: string, wordsPerMinute = 200): number {
  // Remove markdown syntax for word count
  const text = markdown
    .replace(/[#*`>\-_\[\]()]/g, '') // Remove markdown symbols
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .trim();

  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return readingTime;
}

/**
 * Generate excerpt from markdown
 */
export function generateExcerpt(markdown: string, maxLength = 160): string {
  const text = extractTextFromMarkdown(markdown, maxLength);
  return text;
}

/**
 * Validate markdown content
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateMarkdown(markdown: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check empty content
  if (!markdown || markdown.trim().length === 0) {
    errors.push('محتوا نمی‌تواند خالی باشد');
  }

  // Check maximum length
  if (markdown.length > 100000) {
    errors.push('محتوا بیش از 100,000 کاراکتر است');
  }

  // Check for unbalanced brackets
  const openBrackets = (markdown.match(/\[/g) || []).length;
  const closeBrackets = (markdown.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    warnings.push('تعداد براکت‌های باز و بسته برابر نیست');
  }

  // Check for orphaned links
  const orphanedLinks = markdown.match(/\]\(/g) || [];
  if (orphanedLinks.length > 0) {
    warnings.push('لینک‌های نامعتبر پیدا شد');
  }

  // Check for broken images
  const brokenImages = markdown.match(/!\[\]\(/g) || [];
  if (brokenImages.length > 0) {
    warnings.push('تصاویری با توضیح خالی پیدا شد');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Format markdown with proper spacing and structure
 */
export function formatMarkdown(markdown: string): string {
  let formatted = markdown;

  // Add spacing after headings
  formatted = formatted.replace(/(#{1,6}\s.+)\n(?![\n#])/g, '$1\n\n');

  // Add spacing between paragraphs
  formatted = formatted.replace(/\n(?!\n)/g, '\n\n');

  // Clean up excessive newlines
  formatted = formatted.replace(/\n\n\n+/g, '\n\n');

  // Normalize spaces
  formatted = formatted.replace(/\s+\n/g, '\n');

  return formatted.trim();
}

/**
 * Add table of contents to markdown
 */
export function addTableOfContents(markdown: string): string {
  const headings = markdown.match(/^#{1,6}\s.+$/gm) || [];
  
  if (headings.length === 0) {
    return markdown;
  }

  let toc = '## فهرست مطالب\n\n';

  headings.forEach((heading) => {
    const match = heading.match(/^#+/);
    if (!match) return;
    
    const level = match[0].length;
    const text = heading.replace(/^#+\s/, '');
    const anchor = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '');

    const indent = '  '.repeat(Math.max(0, level - 2));
    toc += `${indent}- [${text}](#${anchor})\n`;
  });

  return toc + '\n\n---\n\n' + markdown;
}

/**
 * Extract metadata from markdown frontmatter
 */
export interface FrontMatter {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  tags?: string[];
  [key: string]: unknown;
}

export function extractFrontMatter(markdown: string): { metadata: FrontMatter; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content: markdown };
  }

  const metadata: FrontMatter = {};
  const frontmatterContent = match[1];

  // Parse YAML-like frontmatter
  frontmatterContent.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      metadata[key.trim()] = value;
    }
  });

  return {
    metadata,
    content: match[2],
  };
}

/**
 * Create frontmatter from metadata
 */
export function createFrontMatter(metadata: FrontMatter): string {
  let frontmatter = '---\n';

  Object.entries(metadata).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      frontmatter += `${key}: [${value.join(', ')}]\n`;
    } else if (typeof value === 'object') {
      frontmatter += `${key}: ${JSON.stringify(value)}\n`;
    } else {
      frontmatter += `${key}: ${value}\n`;
    }
  });

  frontmatter += '---\n\n';

  return frontmatter;
}
