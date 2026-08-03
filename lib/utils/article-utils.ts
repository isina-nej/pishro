/**
 * Article Utility Functions
 * Helpers for processing and analyzing article content
 */

/**
 * Extract plain text from HTML or Markdown
 */
export function extractPlainText(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]+>/g, '');
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text.trim();
}

/**
 * Calculate reading time in minutes
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

/**
 * Extract first N characters of text, preserving word boundaries
 */
export function truncateText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

/**
 * Extract headings from Markdown/HTML content
 */
export function extractHeadings(content: string): Array<{ level: number; text: string }> {
  const headings: Array<{ level: number; text: string }> = [];
  
  // Match Markdown headings
  const mdHeadingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  
  while ((match = mdHeadingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*_~`\[\]()]/g, ''); // Remove Markdown formatting
    headings.push({ level, text });
  }
  
  // Match HTML headings if no Markdown headings found
  if (headings.length === 0) {
    const htmlHeadingRegex = /<h([1-6])[^>]*>([^<]+)<\/h\1>/gi;
    while ((match = htmlHeadingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/[<>/"]/g, '');
      headings.push({ level, text });
    }
  }
  
  return headings;
}

/** A formatting mark attached to a ProseMirror text node */
export interface ProseMirrorMark {
  type: string;
  attrs?: Record<string, unknown>;
}

/** Minimal ProseMirror document node - only the parts this app walks/renders */
export interface ProseMirrorNode {
  type?: string;
  text?: string;
  marks?: ProseMirrorMark[];
  attrs?: Record<string, unknown>;
  content?: ProseMirrorNode[];
}

/**
 * Extract summary from ProseMirror JSON content
 */
export function extractProseMirrorSummary(jsonString: string, maxChars: number = 200): string {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || parsed.type !== 'doc') return '';
    
    let text = '';
    const collectText = (content: ProseMirrorNode[]): void => {
      for (const node of content) {
        if (node.type === 'text') {
          text += node.text || '';
        } else if (node.type === 'paragraph' && node.content) {
          collectText(node.content);
          text += '\n';
        } else if (node.content) {
          collectText(node.content);
        }
        
        if (text.length >= maxChars) break;
      }
    };
    
    if (parsed.content) {
      collectText(parsed.content);
    }
    
    return truncateText(text.trim(), maxChars);
  } catch {
    return '';
  }
}
