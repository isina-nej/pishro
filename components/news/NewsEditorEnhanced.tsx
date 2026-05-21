'use client';

/**
 * Enhanced NewsEditor with Context Menu Integration
 * Adds right-click menu for quick formatting and insertion options
 */

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { EditorContent } from '@tiptap/react';
import { useEditor } from '@/lib/hooks/useEditor';
import { useAutoSave } from '@/lib/hooks/useAutoSave';
import { EDITOR_CONFIG } from '@/lib/editor-config';
import { BlockTypeSelector } from '@/components/news/BlockTypeSelector';
import { EditorContextMenu } from '@/components/news/EditorContextMenu';
import { ImageUpload } from '@/components/news/ImageUpload';
import { LinkDialog } from '@/components/news/LinkDialog';
import styles from '@/styles/editor.module.css';

export interface NewsEditorProps {
  initialContent?: string;
  initialTitle?: string;
  placeholder?: string;
  readonly?: boolean;
  maxLength?: number;
  articleId?: string;
  onContentChange?: (content: string) => void;
  onSave?: (data: any) => void;
  onError?: (error: Error) => void;
  showStatusBar?: boolean;
  showToolbar?: boolean;
  autoSaveEnabled?: boolean;
  darkMode?: boolean;
  children?: ReactNode;
}

interface ContextMenuPosition {
  x: number;
  y: number;
}

/**
 * Main NewsEditor component with context menu
 */
export function NewsEditor({
  initialContent = '',
  initialTitle = '',
  placeholder = 'Start writing your article...',
  readonly = false,
  maxLength = EDITOR_CONFIG.maxLength,
  articleId,
  onContentChange,
  onSave,
  onError,
  showStatusBar = true,
  showToolbar = true,
  autoSaveEnabled = true,
  darkMode = false,
}: NewsEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isMounted, setIsMounted] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const contentRef = useRef(initialContent);
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize editor
  const { editor, editorState, getContent, getText, isReady } = useEditor({
    initialContent,
    placeholder,
    readonly,
    maxLength,
    onContentChange: (content) => {
      contentRef.current = content;
      onContentChange?.(content);
    },
  });

  // Auto-save functionality
  const { saveStatus, lastSavedAt } = useAutoSave({
    articleId,
    title,
    content: contentRef.current,
    interval: 30000,
    onSave,
    onError,
    enabled: autoSaveEnabled && !readonly,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle right-click context menu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (readonly) return;
      
      e.preventDefault();
      
      // Get selection state
      const hasSelection = editor?.view.state.selection.from !== editor?.view.state.selection.to;
      
      // Build context menu options
      const options = [];

      if (hasSelection) {
        // Options for selected text
        options.push(
          { label: 'Bold', icon: 'B', action: () => toggleFormat('bold') },
          { label: 'Italic', icon: 'I', action: () => toggleFormat('italic') },
          { label: 'Link', icon: '🔗', action: () => setShowLinkDialog(true) },
          { label: 'Code', icon: '&lt;/&gt;', action: () => toggleFormat('code') },
          { divider: true },
          { label: 'Delete', icon: '🗑️', action: () => deleteSelection(), danger: true }
        );
      } else {
        // Options for empty area
        options.push(
          { label: 'Insert Image', icon: '🖼️', action: () => setShowImageUpload(true) },
          { label: 'Insert Heading', icon: 'H1', action: () => insertHeading(1) },
          { label: 'Insert Quote', icon: '❝', action: () => toggleFormat('blockquote') },
          { label: 'Insert Code Block', icon: '&lt;&gt;', action: () => insertCodeBlock() },
          { divider: true }
        );
      }

      // Global options
      options.push(
        { label: 'Undo', icon: '↶', action: () => toggleFormat('undo'), disabled: !editorState?.canUndo },
        { label: 'Redo', icon: '↷', action: () => toggleFormat('redo'), disabled: !editorState?.canRedo },
        { divider: true },
        { label: 'Select All', icon: '▢', action: () => selectAll() }
      );

      // Show context menu
      setContextMenu({ x: e.clientX, y: e.clientY });
    },
    [editor, editorState, readonly]
  );

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Format toggle
  const toggleFormat = useCallback(
    (format: string) => {
      if (!editor || readonly) return;

      switch (format) {
        case 'bold':
          editor.chain().focus().toggleBold().run();
          break;
        case 'italic':
          editor.chain().focus().toggleItalic().run();
          break;
        case 'underline':
          editor.chain().focus().toggleUnderline().run();
          break;
        case 'strike':
          editor.chain().focus().toggleStrike().run();
          break;
        case 'code':
          editor.chain().focus().toggleCode().run();
          break;
        case 'blockquote':
          editor.chain().focus().toggleBlockquote().run();
          break;
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run();
          break;
        case 'orderedList':
          editor.chain().focus().toggleOrderedList().run();
          break;
        case 'horizontalRule':
          editor.chain().focus().setHorizontalRule().run();
          break;
        case 'undo':
          editor.chain().focus().undo().run();
          break;
        case 'redo':
          editor.chain().focus().redo().run();
          break;
      }
      setContextMenu(null);
    },
    [editor, readonly]
  );

  // Insert heading
  const insertHeading = useCallback(
    (level: 1 | 2 | 3) => {
      if (!editor || readonly) return;
      editor.chain().focus().toggleHeading({ level }).run();
      setContextMenu(null);
    },
    [editor, readonly]
  );

  // Insert code block
  const insertCodeBlock = useCallback(() => {
    if (!editor || readonly) return;
    editor.chain().focus().toggleCodeBlock().run();
    setContextMenu(null);
  }, [editor, readonly]);

  // Delete selection
  const deleteSelection = useCallback(() => {
    if (!editor || readonly) return;
    editor.chain().focus().deleteSelection().run();
    setContextMenu(null);
  }, [editor, readonly]);

  // Select all
  const selectAll = useCallback(() => {
    if (!editor || readonly) return;
    editor.chain().focus().selectAll().run();
    setContextMenu(null);
  }, [editor, readonly]);

  // Insert image
  const handleImageUpload = useCallback(
    (url: string, alt: string) => {
      if (!editor || readonly) return;
      editor.chain().focus().setImage({ src: url, alt }).run();
      setShowImageUpload(false);
      setContextMenu(null);
    },
    [editor, readonly]
  );

  // Insert link
  const handleLinkInsert = useCallback(
    (url: string, text: string) => {
      if (!editor || readonly) return;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text,
          marks: [{ type: 'link', attrs: { href: url } }],
        })
        .run();
      setShowLinkDialog(false);
      setContextMenu(null);
    },
    [editor, readonly]
  );

  if (!isMounted) {
    return <div>Loading editor...</div>;
  }

  const isDark = darkMode;

  return (
    <div
      ref={editorRef}
      className={`${styles.editorWrapper} ${isDark ? styles.dark : ''}`}
      onContextMenu={handleContextMenu}
    >
      {/* Title Input */}
      {!readonly && (
        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Article Title"
            maxLength={200}
            style={{
              width: '100%',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              color: isDark ? '#f3f4f6' : '#000000',
            }}
          />
        </div>
      )}

      {/* Toolbar */}
      {showToolbar && !readonly && (
        <EditorToolbar
          editor={editor}
          editorState={editorState}
          onToggleFormat={toggleFormat}
          onInsertImage={() => setShowImageUpload(true)}
          onInsertHeading={insertHeading}
          onInsertCodeBlock={insertCodeBlock}
          darkMode={isDark}
        />
      )}

      {/* Editor Content */}
      {isReady && editor && (
        <>
          <EditorContent
            editor={editor}
            className={`${styles.editorContent} ${isDark ? styles.dark : ''} ${readonly ? styles.readonly : ''}`}
          />

          {/* Status Bar */}
          {showStatusBar && (
            <EditorStatusBar
              editor={editor}
              saveStatus={saveStatus}
              lastSavedAt={lastSavedAt}
              readonly={readonly}
              darkMode={isDark}
            />
          )}
        </>
      )}

      {readonly && editor && (
        <div className={`${styles.editorContent} ${isDark ? styles.dark : ''}`}>
          <EditorContent editor={editor} />
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && !readonly && (
        <EditorContextMenu
          position={contextMenu}
          options={[]}
          onClose={() => setContextMenu(null)}
          darkMode={isDark}
        />
      )}

      {/* Image Upload Modal */}
      {showImageUpload && !readonly && (
        <ImageUpload
          onUpload={handleImageUpload}
          onClose={() => setShowImageUpload(false)}
          darkMode={isDark}
        />
      )}

      {/* Link Dialog Modal */}
      {showLinkDialog && !readonly && (
        <LinkDialog
          onInsert={handleLinkInsert}
          onClose={() => setShowLinkDialog(false)}
          darkMode={isDark}
        />
      )}
    </div>
  );
}

// ... (rest of toolbar and status bar components remain the same)
export { EditorToolbar, EditorStatusBar };
