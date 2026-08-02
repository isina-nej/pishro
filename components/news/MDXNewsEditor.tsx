'use client';

/**
 * MDXEditor Component for News Articles
 * Professional markdown editor with RTL Persian support
 * Features: auto-save, image upload, code highlighting, dark mode
 */

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense,
} from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';

// Dynamically import MDXEditor with no SSR
const MDXEditor = dynamic(
  () => import('@mdxeditor/editor').then((mod) => mod.MDXEditor),
  { ssr: false }
);

// Import plugins statically since they are needed at compile time
import {
  headingsPlugin,
  toolbarPlugin,
  linkPlugin,
  imagePlugin,
  codeBlockPlugin,
  quotePlugin,
  listsPlugin,
  tablePlugin,
  thematicBreakPlugin,
  frontmatterPlugin,
  diffSourcePlugin,
} from '@mdxeditor/editor';

import type { MDXEditorMethods } from '@mdxeditor/editor';

import '@mdxeditor/editor/style.css';

export interface MDXNewsEditorProps {
  initialContent?: string;
  initialTitle?: string;
  placeholder?: string;
  readonly?: boolean;
  articleId?: string;
  onContentChange?: (content: string) => void;
  onTitleChange?: (title: string) => void;
  onSave?: (data: { title: string; content: string }) => Promise<void>;
  onError?: (error: Error) => void;
  autoSaveEnabled?: boolean;
  autoSaveInterval?: number;
}

interface EditorRef {
  getMarkdown: () => Promise<string>;
  setMarkdown: (markdown: string) => void;
  focus: () => void;
}

/**
 * Loading fallback component
 */
const EditorLoadingFallback = () => (
  <div className="flex items-center justify-center h-64 bg-slate-100 dark:bg-slate-900 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
      <p className="text-slate-600 dark:text-slate-400">بارگذاری ویرایشگر...</p>
    </div>
  </div>
);

/**
 * Main MDX News Editor Component
 */
export const MDXNewsEditor = React.forwardRef<
  EditorRef | null,
  MDXNewsEditorProps
>(
  (
    {
      initialContent = '',
      initialTitle = '',
      placeholder = 'شروع نوشتن مقاله...',
      readonly = false,
      articleId,
      onContentChange,
      onTitleChange,
      onSave,
      onError,
      autoSaveEnabled = true,
      autoSaveInterval = 30000, // 30 seconds
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [title, setTitle] = useState(initialTitle);
    const [isMounted, setIsMounted] = useState(false);
    const [saveStatus, setSaveStatus] = useState<
      'idle' | 'saving' | 'saved' | 'error'
    >('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const editorRef = useRef<MDXEditorMethods | null>(null);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const contentRef = useRef(initialContent);
    const titleRef = useRef(initialTitle);

    // Initialize component on mount
    useEffect(() => {
      setIsMounted(true);
      return () => {
        if (autoSaveTimerRef.current) {
          clearInterval(autoSaveTimerRef.current);
        }
      };
    }, []);

    // Expose editor methods through ref
    React.useImperativeHandle(ref, () => ({
      getMarkdown: async () => {
        return contentRef.current;
      },
      setMarkdown: (markdown: string) => {
        contentRef.current = markdown;
      },
      focus: () => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      },
    }));

    // Handle content changes
    const handleContentChange = useCallback(
      (content: string) => {
        contentRef.current = content;
        onContentChange?.(content);
        setSaveStatus('idle');
      },
      [onContentChange]
    );

    // Handle auto-save
    const performAutoSave = useCallback(async () => {
      if (!autoSaveEnabled || !articleId || !onSave) return;

      try {
        setSaveStatus('saving');
        const content = contentRef.current;

        await onSave({
          title: titleRef.current,
          content,
        });

        setLastSavedAt(new Date());
        setSaveStatus('saved');

        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Save failed');
        setSaveStatus('error');
        onError?.(err);
        console.error('Auto-save failed:', err);
        toast.error('خطا در ذخیره خودکار');
      }
    }, [autoSaveEnabled, articleId, onSave, onError]);

    // Setup auto-save interval
    useEffect(() => {
      if (!autoSaveEnabled || !articleId) return;

      autoSaveTimerRef.current = setInterval(() => {
        performAutoSave();
      }, autoSaveInterval);

      return () => {
        if (autoSaveTimerRef.current) {
          clearInterval(autoSaveTimerRef.current);
        }
      };
    }, [autoSaveEnabled, articleId, autoSaveInterval, performAutoSave]);

    // Determine dark mode
    const isDark = theme === 'dark';

    if (!isMounted) {
      return <EditorLoadingFallback />;
    }

    return (
      <div
        className={`mdx-editor-wrapper ${isDark ? 'dark' : ''}`}
        style={{
          direction: 'rtl',
        }}
      >
        <style>{`
          .mdx-editor-wrapper {
            direction: rtl;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .mdx-editor-wrapper .mdxeditor {
            border-radius: 0.5rem;
            border: 1px solid rgb(226, 232, 240);
            overflow: hidden;
          }

          .dark .mdx-editor-wrapper .mdxeditor {
            border-color: rgb(51, 65, 85);
          }

          /* RTL Support */
          .mdx-editor-wrapper .mdxeditor-toolbar {
            flex-direction: row-reverse;
            gap: 0.5rem;
            padding: 0.75rem;
            background: rgb(248, 250, 252);
            border-bottom: 1px solid rgb(226, 232, 240);
          }

          .dark .mdx-editor-wrapper .mdxeditor-toolbar {
            background: rgb(30, 41, 59);
            border-bottom-color: rgb(51, 65, 85);
          }

          /* Editor content area */
          .mdx-editor-wrapper .mdxeditor .mdxeditor-input {
            padding: 1rem;
            min-height: 500px;
            font-size: 1rem;
            line-height: 1.75;
            color: rgb(30, 41, 59);
          }

          .dark .mdx-editor-wrapper .mdxeditor .mdxeditor-input {
            background: rgb(15, 23, 42);
            color: rgb(226, 232, 240);
          }

          /* Preview pane */
          .mdx-editor-wrapper .mdxeditor .mdxeditor-preview {
            padding: 1rem;
            background: rgb(255, 255, 255);
            border-left: 1px solid rgb(226, 232, 240);
          }

          .dark .mdx-editor-wrapper .mdxeditor .mdxeditor-preview {
            background: rgb(15, 23, 42);
            border-left-color: rgb(51, 65, 85);
          }

          /* Typography in preview */
          .mdx-editor-wrapper .mdxeditor-preview h1,
          .mdx-editor-wrapper .mdxeditor-preview h2,
          .mdx-editor-wrapper .mdxeditor-preview h3,
          .mdx-editor-wrapper .mdxeditor-preview h4,
          .mdx-editor-wrapper .mdxeditor-preview h5,
          .mdx-editor-wrapper .mdxeditor-preview h6 {
            text-align: right;
            color: rgb(15, 23, 42);
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
          }

          .dark .mdx-editor-wrapper .mdxeditor-preview h1,
          .dark .mdx-editor-wrapper .mdxeditor-preview h2,
          .dark .mdx-editor-wrapper .mdxeditor-preview h3,
          .dark .mdx-editor-wrapper .mdxeditor-preview h4,
          .dark .mdx-editor-wrapper .mdxeditor-preview h5,
          .dark .mdx-editor-wrapper .mdxeditor-preview h6 {
            color: rgb(241, 245, 249);
          }

          .mdx-editor-wrapper .mdxeditor-preview p {
            text-align: right;
            color: rgb(51, 65, 85);
            line-height: 1.85;
            margin-bottom: 1rem;
          }

          .dark .mdx-editor-wrapper .mdxeditor-preview p {
            color: rgb(203, 213, 225);
          }

          /* Lists */
          .mdx-editor-wrapper .mdxeditor-preview ul,
          .mdx-editor-wrapper .mdxeditor-preview ol {
            text-align: right;
            padding-right: 2rem;
          }

          .mdx-editor-wrapper .mdxeditor-preview li {
            margin-bottom: 0.5rem;
            color: rgb(51, 65, 85);
          }

          .dark .mdx-editor-wrapper .mdxeditor-preview li {
            color: rgb(203, 213, 225);
          }

          /* Code blocks */
          .mdx-editor-wrapper .mdxeditor-preview pre {
            background: rgb(15, 23, 42);
            color: rgb(226, 232, 240);
            padding: 1rem;
            border-radius: 0.375rem;
            overflow-x: auto;
            margin: 1rem 0;
            direction: ltr;
            text-align: left;
          }

          .mdx-editor-wrapper .mdxeditor-preview code {
            background: rgb(30, 41, 59);
            color: rgb(34, 197, 94);
            padding: 0.125rem 0.375rem;
            border-radius: 0.25rem;
            font-family: 'Courier New', monospace;
            font-size: 0.875em;
            direction: ltr;
          }

          .dark .mdx-editor-wrapper .mdxeditor-preview code {
            background: rgb(51, 65, 85);
            color: rgb(74, 222, 128);
          }

          /* Blockquotes */
          .mdx-editor-wrapper .mdxeditor-preview blockquote {
            border-right: 4px solid rgb(59, 130, 246);
            padding-right: 1rem;
            margin: 1.5rem 0;
            color: rgb(71, 85, 105);
            font-style: italic;
          }

          .dark .mdx-editor-wrapper .mdxeditor-preview blockquote {
            border-right-color: rgb(93, 168, 234);
            color: rgb(148, 163, 184);
          }

          /* Save status indicator */
          .save-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            color: rgb(100, 116, 139);
            margin-top: 0.5rem;
          }

          .dark .save-status {
            color: rgb(148, 163, 184);
          }

          .save-status.saving {
            color: rgb(59, 130, 246);
          }

          .save-status.saved {
            color: rgb(34, 197, 94);
          }

          .save-status.error {
            color: rgb(239, 68, 68);
          }

          /* Spinner animation */
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .spinner {
            animation: spin 1s linear infinite;
            display: inline-block;
            width: 1rem;
            height: 1rem;
          }
        `}</style>

        {/* Title input */}
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              titleRef.current = e.target.value;
              onTitleChange?.(e.target.value);
            }}
            placeholder="عنوان مقاله..."
            className={`w-full px-4 py-3 text-2xl font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              readonly ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            readOnly={readonly}
            disabled={readonly}
          />
        </div>

        {/* Editor */}
        <Suspense fallback={<EditorLoadingFallback />}>
          <div className="mdx-editor-container">
            <MDXEditor
              ref={editorRef}
              markdown={initialContent}
              onChange={handleContentChange}
              readOnly={readonly}
              autoFocus={false}
              contentEditableClassName="mdxeditor-input prose dark:prose-invert max-w-none"
              className="mdxeditor"
              placeholder={placeholder}
              plugins={[
                headingsPlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      {/* Toolbar buttons will be auto-generated */}
                    </>
                  ),
                }),
                linkPlugin(),
                imagePlugin({
                  imageUploadHandler: async (file: File) => {
                    // Handle image upload
                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                      const response = await fetch('/api/upload/image', {
                        method: 'POST',
                        body: formData,
                      });

                      if (!response.ok) {
                        throw new Error('Image upload failed');
                      }

                      const data = await response.json();
                      toast.success('تصویر آپلود شد');
                      return data.url;
                    } catch (error) {
                      toast.error('خطا در آپلود تصویر');
                      throw error;
                    }
                  },
                }),
                codeBlockPlugin(),
                quotePlugin(),
                listsPlugin(),
                tablePlugin(),
                thematicBreakPlugin(),
                frontmatterPlugin(),
                diffSourcePlugin(),
              ]}
            />
          </div>
        </Suspense>

        {/* Auto-save status */}
        {autoSaveEnabled && articleId && (
          <div
            className={`save-status ${saveStatus}`}
            style={{
              textAlign: 'right',
            }}
          >
            {saveStatus === 'saving' && (
              <>
                <span className="spinner">⏳</span>
                <span>در حال ذخیره...</span>
              </>
            )}
            {saveStatus === 'saved' && lastSavedAt && (
              <>
                <span>✓</span>
                <span>
                  ذخیره شد - {lastSavedAt.toLocaleTimeString('fa-IR')}
                </span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <span>✗</span>
                <span>خطا در ذخیره</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

MDXNewsEditor.displayName = 'MDXNewsEditor';

export default MDXNewsEditor;
