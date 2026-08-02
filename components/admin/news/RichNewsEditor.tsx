'use client';

/**
 * Rich News Editor Component
 * TipTap-based rich text editor for creating news articles
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

interface RichNewsEditorProps {
  initialContent?: string;
  onContentChange?: (content: string, html: string) => void;
  onSave?: (content: string, html: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  rtl?: boolean;
}

export default function RichNewsEditor({
  initialContent = '<p>شروع کنید تایپ کردن...</p>',
  onContentChange,
  onSave,
  placeholder = 'محتوای خبر را اینجا بنویسید...',
  disabled = false,
  rtl = true,
}: RichNewsEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({ x: 0, y: 0, visible: false });
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize editor with TipTap extensions
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
      const json = editor.getJSON();
      const html = editor.getHTML();
      const text = editor.getText();

      setCharacterCount(text.length);

      if (onContentChange) {
        onContentChange(JSON.stringify(json), html);
      }
    },
    onSelectionUpdate: () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    },
  });

  // Handle right-click context menu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        visible: true,
      });
    },
    []
  );

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.visible]);

  const handleSave = async () => {
    if (!editor || !onSave) return;
    setIsSaving(true);
    try {
      await onSave(JSON.stringify(editor.getJSON()), editor.getHTML());
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => editor?.chain().focus().undo().run();
  const handleRedo = () => editor?.chain().focus().redo().run();
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  const clearFormatting = () => editor?.chain().focus().clearNodes().run();

  const toggleHeading1 = () => editor?.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleHeading2 = () => editor?.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleHeading3 = () => editor?.chain().focus().toggleHeading({ level: 3 }).run();

  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
  const toggleCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run();

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const insertImage = () => {
    setShowImageModal(true);
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('لطفا یک فایل عکس انتخاب کنید');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل بیش از 5MB است');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Get auth token from cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin_access_token='))
        ?.split('=')[1];

      const response = await fetch('/api/news/upload-temp-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.data?.url) {
        editor?.chain().focus().setImage({ src: data.data.url }).run();
        setShowImageModal(false);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('خطا در آپلود عکس');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const insertLink = () => {
    setModalUrl('');
    setShowLinkModal(true);
  };

  const confirmLinkInsert = () => {
    if (modalUrl.trim()) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: modalUrl }).run();
    }
    setShowLinkModal(false);
    setModalUrl('');
  };

  if (!editor) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-96"></div>;
  }

  return (
    <div
      className={`flex flex-col border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900`}
      dir={rtl ? 'rtl' : 'ltr'}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800 p-3 border-b-2 border-gray-200 dark:border-gray-700 overflow-x-auto">
        {/* Undo/Redo */}
        <button
          onClick={handleUndo}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="Undo"
          disabled={disabled}
        >
          ↶
        </button>
        <button
          onClick={handleRedo}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="Redo"
          disabled={disabled}
        >
          ↷
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* Text Formatting */}
        <button
          onClick={toggleBold}
          className={`p-2 rounded font-bold text-sm ${
            editor.isActive('bold')
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Bold"
          disabled={disabled}
        >
          B
        </button>
        <button
          onClick={toggleItalic}
          className={`p-2 rounded italic text-sm ${
            editor.isActive('italic')
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Italic"
          disabled={disabled}
        >
          I
        </button>
        <button
          onClick={toggleUnderline}
          className={`p-2 rounded underline text-sm ${
            editor.isActive('underline')
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Underline"
          disabled={disabled}
        >
          U
        </button>
        <button
          onClick={toggleStrike}
          className={`p-2 rounded line-through text-sm ${
            editor.isActive('strike')
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Strike"
          disabled={disabled}
        >
          S
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* Headings */}
        <button
          onClick={toggleHeading1}
          className={`p-2 rounded text-xs font-bold ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Heading 1"
          disabled={disabled}
        >
          H1
        </button>
        <button
          onClick={toggleHeading2}
          className={`p-2 rounded text-xs font-bold ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Heading 2"
          disabled={disabled}
        >
          H2
        </button>
        <button
          onClick={toggleHeading3}
          className={`p-2 rounded text-xs font-bold ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Heading 3"
          disabled={disabled}
        >
          H3
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* Lists */}
        <button
          onClick={toggleBulletList}
          className={`p-2 rounded text-sm ${
            editor.isActive('bulletList')
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Bullet List"
          disabled={disabled}
        >
          •
        </button>
        <button
          onClick={toggleOrderedList}
          className={`p-2 rounded text-sm ${
            editor.isActive('orderedList')
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Ordered List"
          disabled={disabled}
        >
          1.
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* Block Elements */}
        <button
          onClick={toggleBlockquote}
          className={`p-2 rounded ${
            editor.isActive('blockquote')
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Quote"
          disabled={disabled}
        >
          ❝
        </button>
        <button
          onClick={toggleCodeBlock}
          className={`p-2 rounded text-sm ${
            editor.isActive('codeBlock')
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Code Block"
          disabled={disabled}
        >
          &lt;/&gt;
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* Media */}
        <button
          onClick={insertImage}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Insert Image"
          disabled={disabled}
        >
          🖼️
        </button>
        <button
          onClick={insertLink}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Insert Link"
          disabled={disabled}
        >
          🔗
        </button>
        <button
          onClick={insertTable}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Insert Table"
          disabled={disabled}
        >
          ⊞
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* Clear Formatting */}
        <button
          onClick={clearFormatting}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs"
          title="Clear Formatting"
          disabled={disabled}
        >
          ✕
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto p-6 prose prose-sm dark:prose-invert max-w-none">
        <EditorContent editor={editor} onContextMenu={handleContextMenu} />
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <div>
          📝 {characterCount} characters
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || disabled}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm">
            🗑️ Delete
          </button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm">
            📋 Duplicate
          </button>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">درج عکس</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileSelect}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer hover:border-blue-500"
              disabled={isUploadingImage}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              فرمت‌های پشتیبانی‌شده: JPG, PNG, WebP (حداکثر 5MB)
            </p>
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700 disabled:opacity-50"
                disabled={isUploadingImage}
              >
                انصراف
              </button>
            </div>
            {isUploadingImage && (
              <div className="mt-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">در حال آپلود...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Insert Link</h3>
            <input
              type="text"
              placeholder="Enter URL..."
              value={modalUrl}
              onChange={(e) => setModalUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') confirmLinkInsert();
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmLinkInsert}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

