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
import { EditorContextMenu, type ContextMenuOption } from '@/components/news/EditorContextMenu';
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
  hasSelection: boolean;
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
  const { editor, editorState, isReady } = useEditor({
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
  useAutoSave({
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

      // The option list itself is built at render time, where the action
      // callbacks below are already in scope.
      const hasSelection =
        editor?.view.state.selection.from !== editor?.view.state.selection.to;

      setContextMenu({ x: e.clientX, y: e.clientY, hasSelection });
    },
    [editor, readonly]
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
    (url: string, text?: string) => {
      if (!editor || readonly) return;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: text || url,
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

  // Context menu entries, built from the selection state captured on right-click
  const contextMenuOptions: ContextMenuOption[] = contextMenu
    ? [
        ...(contextMenu.hasSelection
          ? [
              { label: 'Bold', icon: 'B', onClick: () => toggleFormat('bold') },
              { label: 'Italic', icon: 'I', onClick: () => toggleFormat('italic') },
              { label: 'Link', icon: '🔗', onClick: () => setShowLinkDialog(true) },
              { label: 'Code', icon: '</>', onClick: () => toggleFormat('code') },
              { label: '', divider: true, onClick: () => {} },
              { label: 'Delete', icon: '🗑️', onClick: () => deleteSelection() },
            ]
          : [
              { label: 'Insert Image', icon: '🖼️', onClick: () => setShowImageUpload(true) },
              { label: 'Insert Heading', icon: 'H1', onClick: () => insertHeading(1) },
              { label: 'Insert Quote', icon: '❝', onClick: () => toggleFormat('blockquote') },
              { label: 'Insert Code Block', icon: '<>', onClick: () => insertCodeBlock() },
              { label: '', divider: true, onClick: () => {} },
            ]),
        {
          label: 'Undo',
          icon: '↶',
          onClick: () => toggleFormat('undo'),
          disabled: !editorState?.canUndo,
        },
        {
          label: 'Redo',
          icon: '↷',
          onClick: () => toggleFormat('redo'),
          disabled: !editorState?.canRedo,
        },
        { label: '', divider: true, onClick: () => {} },
        { label: 'Select All', icon: '▢', onClick: () => selectAll() },
      ]
    : [];

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
      {/* Temporarily disabled - component not defined
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
      */}

      {/* Editor Content */}
      {isReady && editor && (
        <>
          <EditorContent
            editor={editor}
            className={`${styles.editorContent} ${isDark ? styles.dark : ''} ${readonly ? styles.readonly : ''}`}
          />

          {/* Status Bar - Temporarily disabled */}
          {/* {showStatusBar && (
            <EditorStatusBar
              editor={editor}
              saveStatus={saveStatus}
              lastSavedAt={lastSavedAt}
              readonly={readonly}
              darkMode={isDark}
            />
          )} */}
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
          options={contextMenuOptions}
          onClose={() => setContextMenu(null)}
          darkMode={isDark}
        />
      )}

      {/* Image Upload Modal */}
      {showImageUpload && !readonly && (
        <ImageUpload
          isOpen={showImageUpload}
          onUpload={handleImageUpload}
          onClose={() => setShowImageUpload(false)}
          darkMode={isDark}
        />
      )}

      {/* Link Dialog Modal */}
      {showLinkDialog && !readonly && (
        <LinkDialog
          isOpen={showLinkDialog}
          onInsert={handleLinkInsert}
          onClose={() => setShowLinkDialog(false)}
          darkMode={isDark}
        />
      )}
    </div>
  );
}

// TODO: Define EditorToolbar and EditorStatusBar components
// export { EditorToolbar, EditorStatusBar };
