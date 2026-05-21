/**
 * Rich Text Editor Configuration
 * Defines sanitization rules, allowed HTML tags, and editor settings
 */

export interface EditorConfig {
  maxLength: number;
  autoSaveInterval: number;
  maxImageDimensions: {
    width: number;
    height: number;
  };
}

export const EDITOR_CONFIG: EditorConfig = {
  maxLength: 1_000_000, // 1MB limit
  autoSaveInterval: 30_000, // 30 seconds in milliseconds
  maxImageDimensions: {
    width: 1920,
    height: 1080,
  },
};

/**
 * Sanitization configuration for HTML content
 * Uses whitelist approach for security
 */
export const SANITIZATION_CONFIG = {
  ALLOWED_TAGS: [
    // Block elements
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
    // Inline elements
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
    // Media
    'img',
  ],
  ALLOWED_ATTRIBUTES: {
    // Link attributes
    a: ['href', 'title', 'target', 'rel'],
    // Image attributes
    img: ['src', 'alt', 'width', 'height', 'title'],
    // Heading attributes
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    // Other
    pre: ['class'],
    code: ['class'],
  },
};

/**
 * Server-side HTML sanitization
 * Removes dangerous content while preserving formatting
 */
export function sanitizeHtmlContent(dirtyHtml: string): string {
  if (!dirtyHtml) return '';

  let html = dirtyHtml;
  
  // Remove script tags
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Remove event handlers
  html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  html = html.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove dangerous protocols
  html = html.replace(/href\s*=\s*["']?javascript:/gi, 'href="#"');
  html = html.replace(/src\s*=\s*["']?javascript:/gi, 'src=""');
  
  return html;
}

/**
 * Keyboard shortcuts configuration
 */
export const KEYBOARD_SHORTCUTS = {
  bold: 'Mod-b',
  italic: 'Mod-i',
  underline: 'Mod-u',
  strikethrough: 'Mod-Shift-x',
  link: 'Mod-k',
  blockquote: 'Mod-Shift-b',
  save: 'Mod-s',
  undo: 'Mod-z',
  redo: 'Mod-Shift-z',
  selectAll: 'Mod-a',
} as const;

/**
 * Block type options for the editor
 */
export const BLOCK_TYPES = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'heading1', label: 'Heading 1' },
  { value: 'heading2', label: 'Heading 2' },
  { value: 'heading3', label: 'Heading 3' },
  { value: 'codeBlock', label: 'Code Block' },
  { value: 'blockquote', label: 'Block Quote' },
  { value: 'bulletList', label: 'Bullet List' },
  { value: 'orderedList', label: 'Ordered List' },
] as const;

/**
 * Supported code languages for syntax highlighting
 */
export const CODE_LANGUAGES = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'swift',
  'kotlin',
  'html',
  'css',
  'scss',
  'less',
  'sql',
  'bash',
  'shell',
  'json',
  'yaml',
  'xml',
  'markdown',
  'plaintext',
] as const;

/**
 * Image upload constraints
 */
export const IMAGE_UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxDimensions: EDITOR_CONFIG.maxImageDimensions,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  uploadPath: '/uploads/articles/',
} as const;
