/**
 * useEditor Hook
 * Manages editor state and provides editor instance
 */

import { useEffect, useState, useCallback } from 'react';
import { useEditor as useTipTapEditor } from '@tiptap/react';
import { createEditorExtensions, getEditorState, EditorState } from '@/lib/editor-extensions';

export interface UseEditorOptions {
  initialContent?: string;
  placeholder?: string;
  readonly?: boolean;
  maxLength?: number;
  onContentChange?: (content: string) => void;
  onStateChange?: (state: EditorState) => void;
}

export function useEditor(options: UseEditorOptions = {}) {
  const {
    initialContent = '',
    placeholder = 'Start typing...',
    readonly = false,
    maxLength = 1_000_000,
    onContentChange,
    onStateChange,
  } = options;

  const [isMounted, setIsMounted] = useState(false);
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  const editor = useTipTapEditor(
    {
      extensions: createEditorExtensions(),
      content: initialContent,
      immediatelyRender: false, // Avoid hydration mismatch
      editorProps: {
        attributes: {
          class:
            'prose prose-sm dark:prose-invert max-w-none focus:outline-none editor-content',
        },
        handlePaste: (view, event) => {
          // Handle paste events
          return false;
        },
      },
      onUpdate: ({ editor }) => {
        if (readonly) return;

        const html = editor.getHTML();
        const text = editor.getText();

        // Check length limit
        if (text.length > maxLength) {
          // Truncate if over limit
          return;
        }

        // Notify of content change
        onContentChange?.(html);

        // Update editor state
        const newState = getEditorState(editor);
        setEditorState(newState);
        onStateChange?.(newState);
      },

      onSelectionUpdate: ({ editor }) => {
        // Update formatting state when selection changes
        const newState = getEditorState(editor);
        setEditorState(newState);
        onStateChange?.(newState);
      },

      editable: !readonly,
    },
    [readonly, maxLength, onContentChange, onStateChange]
  );

  useEffect(() => {
    setIsMounted(true);
    if (editor && !readonly) {
      const state = getEditorState(editor);
      setEditorState(state);
      onStateChange?.(state);
    }
  }, [editor, readonly, onStateChange]);

  // Update editor content from outside
  const setContent = useCallback(
    (content: string) => {
      if (editor && !readonly) {
        editor.commands.setContent(content);
      }
    },
    [editor, readonly]
  );

  // Get current content
  const getContent = useCallback(() => {
    if (!editor) return '';
    return editor.getHTML();
  }, [editor]);

  // Get plain text
  const getText = useCallback(() => {
    if (!editor) return '';
    return editor.getText();
  }, [editor]);

  // Get word count
  const getWordCount = useCallback(() => {
    if (!editor) return 0;
    return editor.storage.characterCount?.words() || 0;
  }, [editor]);

  // Get character count
  const getCharacterCount = useCallback(() => {
    if (!editor) return 0;
    return editor.storage.characterCount?.characters() || 0;
  }, [editor]);

  return {
    editor,
    isMounted,
    editorState,
    setContent,
    getContent,
    getText,
    getWordCount,
    getCharacterCount,
    isReady: isMounted && editor !== null,
  };
}

export default useEditor;
