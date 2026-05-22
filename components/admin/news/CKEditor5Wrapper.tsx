'use client';

/**
 * CKEditor 5-like Editor Component using TipTap
 * Rich text editor for creating news articles
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';
import { AlertCircle } from 'lucide-react';

interface CKEditor5WrapperProps {
  initialContent?: string;
  onContentChange?: (html: string) => void;
  onSave?: (html: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  rtl?: boolean;
  maxHeight?: string;
}

export default function CKEditor5Wrapper({
  initialContent = '',
  onContentChange,
  onSave,
  placeholder = 'محتوای خبر را بنویسید...',
  disabled = false,
  rtl = true,
  maxHeight = '600px',
}: CKEditor5WrapperProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: initialContent,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      
      setCharCount(text.length);
      setError('');
      onContentChange?.(html);
    },
  });

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        editor.chain().focus().setImage({ src: url }).run();
      };
      reader.readAsDataURL(file);
    },
    [editor]
  );

  const handleSave = async () => {
    if (!editor) return;

    const html = editor.getHTML();
    const text = editor.getText();

    if (!text.trim()) {
      setError('محتوا نمی‌تواند خالی باشد');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      await onSave?.(html);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ذخیره کردن');
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />;
  }

  return (
    <div className="space-y-4" dir={rtl ? 'rtl' : 'ltr'}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap bg-gray-100 dark:bg-gray-800 p-2 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run() || disabled}
          className={`px-3 py-2 rounded font-bold ${
            editor.isActive('bold')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Bold (Ctrl+B)"
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run() || disabled}
          className={`px-3 py-2 rounded italic ${
            editor.isActive('italic')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Italic (Ctrl+I)"
        >
          I
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run() || disabled}
          className={`px-3 py-2 rounded line-through ${
            editor.isActive('strike')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Strikethrough"
        >
          S
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run() || disabled}
          className={`px-3 py-2 rounded font-mono ${
            editor.isActive('code')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Inline Code"
        >
          `
        </button>

        <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          className={`px-3 py-2 rounded text-sm font-bold ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Heading 1"
        >
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          className={`px-3 py-2 rounded text-sm font-bold ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Heading 2"
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          className={`px-3 py-2 rounded text-sm font-bold ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Heading 3"
        >
          H3
        </button>

        <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`px-3 py-2 rounded ${
            editor.isActive('bulletList')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Bullet List"
        >
          •
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`px-3 py-2 rounded ${
            editor.isActive('orderedList')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Numbered List"
        >
          1.
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          className={`px-3 py-2 rounded ${
            editor.isActive('blockquote')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Quote"
        >
          ❝
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={disabled}
          className={`px-3 py-2 rounded ${
            editor.isActive('codeBlock')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Code Block"
        >
          {'<>'}
        </button>

        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
          disabled={disabled}
          className="px-3 py-2 rounded bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Insert Table"
        >
          ⊞
        </button>

        <button
          onClick={handleImageUpload}
          disabled={disabled}
          className="px-3 py-2 rounded bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Insert Image"
        >
          🖼️
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageFile}
          className="hidden"
        />

        <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run() || disabled}
          className="px-3 py-2 rounded bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Undo (Ctrl+Z)"
        >
          ↶
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run() || disabled}
          className="px-3 py-2 rounded bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Redo (Ctrl+Y)"
        >
          ↷
        </button>
      </div>

      {/* Editor Container */}
      <div
        className="border-2 border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden shadow-sm bg-white dark:bg-gray-900"
        style={{ maxHeight }}
      >
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none p-4 h-full overflow-auto"
          style={{
            direction: rtl ? 'rtl' : 'ltr',
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
        </div>
      )}

      {/* Stats Footer */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
        <span>📝 {charCount} کاراکتر</span>
        <button
          onClick={handleSave}
          disabled={isSaving || charCount === 0 || disabled}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium text-sm transition"
        >
          {isSaving ? 'درحال ذخیره...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
