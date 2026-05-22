'use client';

/**
 * Markdown Editor Component with Real-time Preview
 * Split-view editor for markdown content with live HTML rendering
 */

import React, { useState, useRef, useEffect } from 'react';
import { useMarkdownPreview } from '@/lib/hooks/useMarkdownPreview';
import { getWordCount, calculateReadingTime } from '@/lib/markdown-processor';

interface MarkdownEditorProps {
  initialContent?: string;
  onContentChange?: (markdown: string, html: string) => void;
  onSave?: (markdown: string, html: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  rtl?: boolean;
  debounceDelay?: number;
  maxHeight?: string;
}

export default function MarkdownEditor({
  initialContent = '',
  onContentChange,
  onSave,
  placeholder = 'محتوای خبر را بر اساس Markdown بنویسید...',
  disabled = false,
  rtl = true,
  debounceDelay = 300,
  maxHeight = '600px',
}: MarkdownEditorProps) {
  const { markdown, html, error, isRendering, setMarkdown, clearError } = useMarkdownPreview(
    initialContent,
    debounceDelay
  );

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Update stats
  useEffect(() => {
    const words = getWordCount(markdown);
    const time = calculateReadingTime(markdown);
    setWordCount(words);
    setReadingTime(time);

    if (onContentChange) {
      onContentChange(markdown, html);
    }
  }, [markdown, html, onContentChange]);

  // Handle save
  const handleSave = async () => {
    if (!onSave || disabled) return;

    setIsSaving(true);
    try {
      await onSave(markdown, html);
    } catch (err) {
      console.error('Save error:', err);
      alert('خطا در ذخیره‌سازی محتوا');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle tab changes
  const handleTabChange = (tab: 'editor' | 'preview') => {
    setActiveTab(tab);
  };

  // Insert markdown syntax helper
  const insertMarkdown = (before: string, after: string = '') => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end);
    const newMarkdown =
      markdown.substring(0, start) +
      before +
      selected +
      after +
      markdown.substring(end);

    setMarkdown(newMarkdown);

    // Restore cursor position after state update
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newPosition = start + before.length;
        textarea.setSelectionRange(newPosition, newPosition + selected.length);
      }
    }, 0);
  };

  const insertHeading = (level: number) => {
    const heading = '#'.repeat(level) + ' ';
    insertMarkdown(heading);
  };

  const insertBold = () => insertMarkdown('**', '**');
  const insertItalic = () => insertMarkdown('*', '*');
  const insertLink = () => insertMarkdown('[متن لینک](', ')');
  const insertImage = () => insertMarkdown('![متن جایگزین](', ')');
  const insertList = () => insertMarkdown('- ');
  const insertOrderedList = () => insertMarkdown('1. ');
  const insertCode = () => insertMarkdown('`', '`');
  const insertCodeBlock = () => insertMarkdown('```\n', '\n```');
  const insertQuote = () => insertMarkdown('> ');
  const insertTable = () => {
    const table = `| ستون ۱ | ستون ۲ | ستون ۳ |
|--------|--------|--------|
| سلول   | سلول   | سلول   |`;
    insertMarkdown(table);
  };

  return (
    <div
      className="flex flex-col border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900"
      dir={rtl ? 'rtl' : 'ltr'}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800 p-3 border-b-2 border-gray-200 dark:border-gray-700 overflow-x-auto">
        {/* Text Formatting */}
        <button
          onClick={() => insertBold()}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm font-bold"
          title="Bold (Ctrl+B)"
          disabled={disabled}
        >
          B
        </button>
        <button
          onClick={() => insertItalic()}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm italic"
          title="Italic (Ctrl+I)"
          disabled={disabled}
        >
          I
        </button>
        <button
          onClick={() => insertCode()}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm font-mono"
          title="Inline Code"
          disabled={disabled}
        >
          `
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* Headings */}
        <div className="flex gap-1">
          <button
            onClick={() => insertHeading(1)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs font-bold"
            title="Heading 1"
            disabled={disabled}
          >
            H1
          </button>
          <button
            onClick={() => insertHeading(2)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs font-bold"
            title="Heading 2"
            disabled={disabled}
          >
            H2
          </button>
          <button
            onClick={() => insertHeading(3)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs font-bold"
            title="Heading 3"
            disabled={disabled}
          >
            H3
          </button>
        </div>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* Lists */}
        <button
          onClick={() => insertList()}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="Unordered List"
          disabled={disabled}
        >
          •
        </button>
        <button
          onClick={() => insertOrderedList()}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="Ordered List"
          disabled={disabled}
        >
          1.
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* Block Elements */}
        <button
          onClick={() => insertQuote()}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="Blockquote"
          disabled={disabled}
        >
          ❝
        </button>
        <button
          onClick={() => insertCodeBlock()}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="Code Block"
          disabled={disabled}
        >
          &lt;/&gt;
        </button>
        <button
          onClick={() => insertTable()}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="Table"
          disabled={disabled}
        >
          ⊞
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* Links & Media */}
        <button
          onClick={() => insertLink()}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="Link"
          disabled={disabled}
        >
          🔗
        </button>
        <button
          onClick={() => insertImage()}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="Image"
          disabled={disabled}
        >
          🖼️
        </button>

        <div className="flex-1"></div>

        {/* Info Toggle */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-400"
          title="Toggle Info"
        >
          ℹ️
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => handleTabChange('editor')}
          className={`flex-1 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'editor'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          📝 ادیتور
        </button>
        <button
          onClick={() => handleTabChange('preview')}
          className={`flex-1 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'preview'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          👁️ پیش‌نمایش
        </button>
      </div>

      {/* Editor and Preview Container */}
      <div className={`overflow-auto flex-1`} style={{ maxHeight }}>
        {/* Editor Tab */}
        {activeTab === 'editor' && (
          <textarea
            ref={editorRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full h-full p-6 resize-none font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
            style={{ minHeight: '400px' }}
          />
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="w-full h-full p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
                  <button
                    onClick={clearError}
                    className="text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {!markdown && (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                <p>چیزی برای نمایش وجود ندارد. تایپ را شروع کنید...</p>
              </div>
            )}

            {markdown && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}

            {isRendering && (
              <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm animate-pulse">
                در حال رندر کردن...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex flex-col sm:flex-row gap-4 text-xs">
          {showInfo && (
            <>
              <span>📊 {wordCount} کلمه</span>
              <span>⏱️ {readingTime} دقیقه</span>
              {isRendering && <span className="text-blue-600 dark:text-blue-400 animate-pulse">در حال رندر...</span>}
            </>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || disabled || !markdown}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          {isSaving ? 'در حال ذخیره...' : '💾 ذخیره'}
        </button>
      </div>
    </div>
  );
}
