'use client';

/**
 * NewsEditor Component
 * Rich text editor for creating and editing news articles
 * Built with TipTap and featuring full formatting capabilities
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

/**
 * Main NewsEditor component
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
  const contentRef = useRef(initialContent);

  // Memoize onContentChange to prevent editor reinitialization
  const handleContentChange = useCallback((content: string) => {
    contentRef.current = content;
    onContentChange?.(content);
  }, [onContentChange]);

  // Initialize editor
  const { editor, editorState, isReady } = useEditor({
    initialContent,
    placeholder,
    readonly,
    maxLength,
    onContentChange: handleContentChange,
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

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Insert image
  const insertImage = useCallback(() => {
    if (!editor || readonly) return;

    const url = prompt('Enter image URL:');
    if (url) {
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: 'Article image' })
        .run();
    }
  }, [editor, readonly]);

  // Insert heading
  const insertHeading = useCallback(
    (level: 1 | 2 | 3) => {
      if (!editor || readonly) return;
      editor.chain().focus().toggleHeading({ level }).run();
    },
    [editor, readonly]
  );

  // Insert code block
  const insertCodeBlock = useCallback(() => {
    if (!editor || readonly) return;
    editor.chain().focus().toggleCodeBlock().run();
  }, [editor, readonly]);

  // Toggle formatting
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
    },
    [editor, readonly]
  );

  if (!isMounted) {
    return <div>Loading editor...</div>;
  }

  const isDark = darkMode;

  return (
    <div className={`${styles.editorWrapper} ${isDark ? styles.dark : ''}`}>
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
          onInsertImage={insertImage}
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

      {readonly && (
        <div className={`${styles.editorContent} ${isDark ? styles.dark : ''}`}>
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}

/**
 * Editor Toolbar Component
 */
function EditorToolbar({
  editor,
  editorState,
  onToggleFormat,
  onInsertImage,
  onInsertHeading,
  onInsertCodeBlock,
  darkMode,
}: any) {
  if (!editor || !editorState) return null;

  return (
    <div className={`${styles.toolbar} ${darkMode ? styles.dark : ''}`}>
      {/* Block Type Selector */}
      <div className={`${styles.toolbarGroup} ${darkMode ? styles.dark : ''}`}>
        <BlockTypeSelector editor={editor} darkMode={darkMode} />
      </div>

      {/* Text Formatting Group */}
      <div className={`${styles.toolbarGroup} ${darkMode ? styles.dark : ''}`}>
        <ToolbarButton
          active={editorState.isBold}
          onClick={() => onToggleFormat('bold')}
          title="Bold (Ctrl+B)"
          darkMode={darkMode}
        >
          <strong>B</strong>
        </ToolbarButton>

        <ToolbarButton
          active={editorState.isItalic}
          onClick={() => onToggleFormat('italic')}
          title="Italic (Ctrl+I)"
          darkMode={darkMode}
        >
          <em>I</em>
        </ToolbarButton>

        <ToolbarButton
          active={editorState.isUnderline}
          onClick={() => onToggleFormat('underline')}
          title="Underline (Ctrl+U)"
          darkMode={darkMode}
        >
          <u>U</u>
        </ToolbarButton>

        <ToolbarButton
          active={editorState.isStrikethrough}
          onClick={() => onToggleFormat('strike')}
          title="Strikethrough"
          darkMode={darkMode}
        >
          <s>S</s>
        </ToolbarButton>

        <ToolbarButton
          active={editorState.isCode}
          onClick={() => onToggleFormat('code')}
          title="Inline Code"
          darkMode={darkMode}
        >
          &lt;/&gt;
        </ToolbarButton>
      </div>

      {/* Block Elements Group */}
      <div className={`${styles.toolbarGroup} ${darkMode ? styles.dark : ''}`}>
        <ToolbarButton
          onClick={() => onInsertHeading(1)}
          title="Heading 1"
          darkMode={darkMode}
        >
          H1
        </ToolbarButton>

        <ToolbarButton
          onClick={() => onInsertHeading(2)}
          title="Heading 2"
          darkMode={darkMode}
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          onClick={() => onInsertHeading(3)}
          title="Heading 3"
          darkMode={darkMode}
        >
          H3
        </ToolbarButton>

        <ToolbarButton
          active={editorState.isBlockquote}
          onClick={() => onToggleFormat('blockquote')}
          title="Block Quote (Ctrl+Shift+B)"
          darkMode={darkMode}
        >
          ❝
        </ToolbarButton>

        <ToolbarButton
          active={editorState.isCodeBlock}
          onClick={onInsertCodeBlock}
          title="Code Block"
          darkMode={darkMode}
        >
          {'<>'}
        </ToolbarButton>
      </div>

      {/* Lists Group */}
      <div className={`${styles.toolbarGroup} ${darkMode ? styles.dark : ''}`}>
        <ToolbarButton
          active={editorState.isList}
          onClick={() => onToggleFormat('bulletList')}
          title="Bullet List"
          darkMode={darkMode}
        >
          •
        </ToolbarButton>

        <ToolbarButton
          active={editorState.isList}
          onClick={() => onToggleFormat('orderedList')}
          title="Ordered List"
          darkMode={darkMode}
        >
          1.
        </ToolbarButton>

        <ToolbarButton
          onClick={() => onToggleFormat('horizontalRule')}
          title="Horizontal Rule"
          darkMode={darkMode}
        >
          ―
        </ToolbarButton>
      </div>

      {/* Media Group */}
      <div className={`${styles.toolbarGroup} ${darkMode ? styles.dark : ''}`}>
        <ToolbarButton
          onClick={onInsertImage}
          title="Insert Image"
          darkMode={darkMode}
        >
          🖼️
        </ToolbarButton>
      </div>

      {/* Undo/Redo Group */}
      <div className={`${styles.toolbarGroup} ${darkMode ? styles.dark : ''}`}>
        <ToolbarButton
          disabled={!editorState.canUndo}
          onClick={() => onToggleFormat('undo')}
          title="Undo (Ctrl+Z)"
          darkMode={darkMode}
        >
          ↶
        </ToolbarButton>

        <ToolbarButton
          disabled={!editorState.canRedo}
          onClick={() => onToggleFormat('redo')}
          title="Redo (Ctrl+Shift+Z)"
          darkMode={darkMode}
        >
          ↷
        </ToolbarButton>
      </div>
    </div>
  );
}

/**
 * Toolbar Button Component
 */
function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
  darkMode,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
  darkMode?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${styles.toolbarButton} ${active ? styles.active : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? styles.dark : ''}`}
    >
      {children}
    </button>
  );
}

/**
 * Editor Status Bar Component
 */
function EditorStatusBar({
  editor,
  saveStatus,
  lastSavedAt,
  readonly,
  darkMode,
}: {
  editor: any;
  saveStatus: string;
  lastSavedAt: Date | null;
  readonly: boolean;
  darkMode: boolean;
}) {
  const wordCount = editor?.storage?.characterCount?.words?.() || 0;
  const charCount = editor?.storage?.characterCount?.characters?.() || 0;

  return (
    <div className={`${styles.statusBar} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.statusBarGroup}>
        <span>Words: {wordCount}</span>
        <span>Characters: {charCount}</span>
      </div>

      {!readonly && (
        <div className={styles.saveStatus}>
          <div
            className={`${styles.saveStatusDot} ${styles[saveStatus as string]}`}
          />
          <span>
            {saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'saved'
                ? lastSavedAt
                  ? `Saved at ${lastSavedAt.toLocaleTimeString()}`
                  : 'Saved'
                : saveStatus === 'error'
                  ? 'Save error'
                  : 'Ready'}
          </span>
        </div>
      )}
    </div>
  );
}

export default NewsEditor;
