/**
 * TipTap Editor Extensions Configuration
 * Defines all editor extensions and their settings
 */

import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import type { Editor } from '@tiptap/core';

/**
 * Configure TipTap extensions for the news editor
 * @param placeholder - Placeholder text shown while the document is empty
 * Returns an array of extension instances
 */
export function createEditorExtensions(placeholder?: string) {
  return [
    // Starter kit with most common formatting (includes bold, italic, link, etc.)
    StarterKit.configure({
      // Customize starter kit components
      heading: {
        levels: [1, 2, 3], // Only H1, H2, H3
      },
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        HTMLAttributes: {
          class: 'ordered-list',
        },
      },
      listItem: {},
      hardBreak: {},
      horizontalRule: {},
      blockquote: {},
      bold: {},
      code: {},
      italic: {},
      strike: {},
      paragraph: {},
      link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https', 'mailto', 'tel'],
        validate: (url: string) => /^https?:\/\/|^mailto:|^tel:/.test(url),
        HTMLAttributes: {
          class: 'editor-link',
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
        },
      },
      dropcursor: {
        color: '#0d8abc',
        width: 2,
      },
    }),

    // Image extension for inserting images
    Image.configure({
      inline: false, // Images are block elements by default
      allowBase64: true,
      HTMLAttributes: {
        class: 'editor-image',
      },
    }),

    // Placeholder shown while the document is empty
    Placeholder.configure({
      placeholder: placeholder ?? '',
    }),
  ];
}

/**
 * Get all available keyboard shortcuts
 * Used for displaying help/documentation
 */
export const EDITOR_SHORTCUTS = {
  formatting: [
    { key: 'Ctrl/Cmd + B', action: 'Bold' },
    { key: 'Ctrl/Cmd + I', action: 'Italic' },
    { key: 'Ctrl/Cmd + U', action: 'Underline' },
    { key: 'Ctrl/Cmd + Shift + X', action: 'Strikethrough' },
    { key: 'Ctrl/Cmd + K', action: 'Insert/Edit Link' },
    { key: 'Ctrl/Cmd + Shift + B', action: 'Block Quote' },
  ],
  navigation: [
    { key: 'Tab', action: 'Indent (in lists)' },
    { key: 'Shift + Tab', action: 'Outdent (in lists)' },
    { key: 'Ctrl/Cmd + Z', action: 'Undo' },
    { key: 'Ctrl/Cmd + Shift + Z', action: 'Redo' },
    { key: 'Ctrl/Cmd + A', action: 'Select All' },
  ],
  editor: [
    { key: 'Ctrl/Cmd + S', action: 'Save Draft' },
    { key: 'Right Click', action: 'Open Context Menu' },
    { key: 'Enter (in heading)', action: 'Create New Paragraph' },
    { key: 'Backspace (at start)', action: 'Merge with Previous Block' },
  ],
} as const;

/**
 * Editor state management helpers
 */
export interface EditorState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  currentHeading: 'h1' | 'h2' | 'h3' | null;
  isList: boolean;
  isBlockquote: boolean;
  isCodeBlock: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Extract current formatting state from editor
 */
export function getEditorState(editor: Editor | null): EditorState {
  if (!editor || !editor.isActive || !editor.can) {
    return {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrikethrough: false,
      isCode: false,
      currentHeading: null,
      isList: false,
      isBlockquote: false,
      isCodeBlock: false,
      canUndo: false,
      canRedo: false,
    };
  }

  try {
    return {
      isBold: editor.isActive('bold') || false,
      isItalic: editor.isActive('italic') || false,
      isUnderline: editor.isActive('underline') || false,
      isStrikethrough: editor.isActive('strike') || false,
      isCode: editor.isActive('code') || false,
      currentHeading: editor.isActive('heading', { level: 1 })
        ? 'h1'
        : editor.isActive('heading', { level: 2 })
          ? 'h2'
          : editor.isActive('heading', { level: 3 })
            ? 'h3'
            : null,
      isList:
        (editor.isActive('bulletList') || editor.isActive('orderedList')) || false,
      isBlockquote: editor.isActive('blockquote') || false,
      isCodeBlock: editor.isActive('codeBlock') || false,
      canUndo: editor.can && editor.can().undo ? editor.can().undo() : false,
      canRedo: editor.can && editor.can().redo ? editor.can().redo() : false,
    };
  } catch {
    // Fallback if any editor methods fail
    return {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrikethrough: false,
      isCode: false,
      currentHeading: null,
      isList: false,
      isBlockquote: false,
      isCodeBlock: false,
      canUndo: false,
      canRedo: false,
    };
  }
}
