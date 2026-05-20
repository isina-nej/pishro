/**
 * M2 Markdown Utilities
 * 
 * Support for parsing and rendering M2 Markdown format with:
 * - Headers (# ## ### etc)
 * - Bold, Italic, Code inline formatting
 * - Lists (ordered and unordered)
 * - Code blocks with syntax highlighting
 * - Images and links
 * - Blockquotes
 * - Horizontal rules
 */

/**
 * Parse M2 Markdown text and extract structure
 */
export interface MarkdownBlock {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'blockquote' | 'hr' | 'image';
  level?: number; // For headings: 1-6
  content?: string; // For paragraph, code, blockquote
  items?: string[]; // For lists
  ordered?: boolean; // For lists
  language?: string; // For code blocks
  src?: string; // For images
  alt?: string; // For images
}

export function parseMarkdown(text: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = text.split('\n');
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Empty line
    if (!trimmed) {
      i++;
      continue;
    }
    
    // Heading
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2]
      });
      i++;
      continue;
    }
    
    // Horizontal rule
    if (trimmed.match(/^(\*\*\*|-{3,}|_{3,})$/)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }
    
    // Code block
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim() || 'plaintext';
      let code = '';
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code += lines[i] + '\n';
        i++;
      }
      blocks.push({
        type: 'code',
        language,
        content: code.slice(0, -1)
      });
      i++; // Skip closing ```
      continue;
    }
    
    // Blockquote
    if (trimmed.startsWith('>')) {
      let quote = trimmed.slice(1).trim();
      i++;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quote += '\n' + lines[i].trim().slice(1).trim();
        i++;
      }
      blocks.push({
        type: 'blockquote',
        content: quote
      });
      continue;
    }
    
    // Ordered list
    const orderedListMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (orderedListMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const itemMatch = lines[i].trim().match(/^\d+\.\s+(.+)$/);
        if (!itemMatch) break;
        items.push(itemMatch[1]);
        i++;
      }
      blocks.push({
        type: 'list',
        ordered: true,
        items
      });
      continue;
    }
    
    // Unordered list
    const unorderedListMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    if (unorderedListMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const itemMatch = lines[i].trim().match(/^[-*+]\s+(.+)$/);
        if (!itemMatch) break;
        items.push(itemMatch[1]);
        i++;
      }
      blocks.push({
        type: 'list',
        ordered: false,
        items
      });
      continue;
    }
    
    // Image
    const imageMatch = trimmed.match(/^!\[(.+?)\]\((.+?)\)$/);
    if (imageMatch) {
      blocks.push({
        type: 'image',
        alt: imageMatch[1],
        src: imageMatch[2]
      });
      i++;
      continue;
    }
    
    // Paragraph
    blocks.push({
      type: 'paragraph',
      content: trimmed
    });
    i++;
  }
  
  return blocks;
}

/**
 * Format inline markdown text (bold, italic, code, links)
 */
export function formatInlineMarkdown(text: string): string {
  // Escape HTML
  let result = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Inline code
  result = result.replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-sm">$1</code>');
  
  // Links
  result = result.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  return result;
}

/**
 * Extract reading time (words / 200)
 */
export function getReadingTime(markdown: string): number {
  const words = markdown.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Generate excerpt from markdown (first 150 chars without formatting)
 */
export function getExcerpt(markdown: string, maxLength: number = 150): string {
  // Remove markdown syntax
  let text = markdown
    .replace(/#+\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/!\[.+?\]\(.+?\)/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^> .+$/gm, '')
    .replace(/[-*+]\s/g, '')
    .replace(/\d+\.\s/g, '');
  
  return text.substring(0, maxLength).trim() + (text.length > maxLength ? '...' : '');
}
