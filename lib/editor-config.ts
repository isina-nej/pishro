/**
 * Rich Text Editor Configuration
 * Defines editor settings, keyboard shortcuts, and upload constraints
 *
 * HTML sanitization is NOT handled here — use `sanitizeContent` from
 * `@/lib/sanitize-content` for any content rendered as HTML.
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
