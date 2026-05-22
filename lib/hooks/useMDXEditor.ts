/**
 * Hook for managing MDXEditor state and operations
 * Location: lib/hooks/useMDXEditor.ts
 */

import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { mdxNewsService } from '@/lib/services/mdx-news-service';
import { validateMarkdown } from '@/lib/utils/mdx-editor-utils';
import type { CreateMDXNewsDTO, UpdateMDXNewsDTO } from '@/lib/services/mdx-news-service';

export interface UseMDXEditorOptions {
  initialTitle?: string;
  initialContent?: string;
  articleId?: string;
  autoSaveEnabled?: boolean;
  autoSaveInterval?: number;
  onSuccess?: (article: any) => void;
  onError?: (error: Error) => void;
}

export interface EditorState {
  title: string;
  content: string;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt: Date | null;
  lastError: Error | null;
}

export function useMDXEditor(options: UseMDXEditorOptions = {}) {
  const {
    initialTitle = '',
    initialContent = '',
    articleId,
    autoSaveEnabled = false,
    autoSaveInterval = 30000,
    onSuccess,
    onError,
  } = options;

  // State
  const [state, setState] = useState<EditorState>({
    title: initialTitle,
    content: initialContent,
    isDirty: false,
    isSaving: false,
    isPublishing: false,
    saveStatus: 'idle',
    lastSavedAt: null,
    lastError: null,
  });

  // Refs
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef({ title: initialTitle, content: initialContent });

  // Update title
  const setTitle = useCallback((title: string) => {
    setState((prev) => ({
      ...prev,
      title,
      isDirty: title !== lastSavedRef.current.title || prev.content !== lastSavedRef.current.content,
    }));
  }, []);

  // Update content
  const setContent = useCallback((content: string) => {
    setState((prev) => ({
      ...prev,
      content,
      isDirty: prev.title !== lastSavedRef.current.title || content !== lastSavedRef.current.content,
    }));
  }, []);

  // Validate content
  const validateContent = useCallback((): boolean => {
    const validation = validateMarkdown(state.content);

    if (!validation.valid) {
      const errorMessage = validation.errors[0] || 'محتوای نامعتبر';
      setState((prev) => ({
        ...prev,
        saveStatus: 'error',
        lastError: new Error(errorMessage),
      }));
      toast.error(errorMessage);
      return false;
    }

    if (!state.title.trim()) {
      const error = new Error('عنوان الزامی است');
      setState((prev) => ({
        ...prev,
        saveStatus: 'error',
        lastError: error,
      }));
      toast.error('عنوان الزامی است');
      return false;
    }

    return true;
  }, [state.title, state.content]);

  // Save draft
  const saveDraft = useCallback(async () => {
    if (!validateContent()) return null;

    setState((prev) => ({
      ...prev,
      isSaving: true,
      saveStatus: 'saving',
      lastError: null,
    }));

    try {
      const data: CreateMDXNewsDTO = {
        title: state.title.trim(),
        content: state.content,
        draft: true,
      };

      let result;
      if (articleId) {
        result = await mdxNewsService.updateArticle(articleId, data);
      } else {
        result = await mdxNewsService.createArticle(data);
      }

      setState((prev) => ({
        ...prev,
        isSaving: false,
        saveStatus: 'saved',
        isDirty: false,
        lastSavedAt: new Date(),
      }));

      lastSavedRef.current = { title: state.title, content: state.content };

      toast.success('پیش‌نویس ذخیره شد');
      onSuccess?.(result);

      // Reset status
      setTimeout(() => {
        setState((prev) => ({ ...prev, saveStatus: 'idle' }));
      }, 2000);

      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('خطای نامشخص');
      setState((prev) => ({
        ...prev,
        isSaving: false,
        saveStatus: 'error',
        lastError: err,
      }));

      toast.error(err.message);
      onError?.(err);

      return null;
    }
  }, [state.title, state.content, articleId, validateContent, onSuccess, onError]);

  // Publish
  const publish = useCallback(async () => {
    if (!validateContent()) return null;

    setState((prev) => ({
      ...prev,
      isPublishing: true,
      saveStatus: 'saving',
      lastError: null,
    }));

    try {
      const data: CreateMDXNewsDTO | UpdateMDXNewsDTO = {
        title: state.title.trim(),
        content: state.content,
        draft: false,
        publishedAt: new Date().toISOString(),
      };

      let result;
      if (articleId) {
        result = await mdxNewsService.updateArticle(articleId, data as UpdateMDXNewsDTO);
      } else {
        result = await mdxNewsService.createArticle(data as CreateMDXNewsDTO);
      }

      setState((prev) => ({
        ...prev,
        isPublishing: false,
        saveStatus: 'saved',
        isDirty: false,
        lastSavedAt: new Date(),
      }));

      lastSavedRef.current = { title: state.title, content: state.content };

      toast.success('مقاله منتشر شد');
      onSuccess?.(result);

      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('خطای نامشخص');
      setState((prev) => ({
        ...prev,
        isPublishing: false,
        saveStatus: 'error',
        lastError: err,
      }));

      toast.error(err.message);
      onError?.(err);

      return null;
    }
  }, [state.title, state.content, articleId, validateContent, onSuccess, onError]);

  // Auto-save setup
  const enableAutoSave = useCallback(() => {
    if (!autoSaveEnabled || !articleId) return;

    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setInterval(() => {
      if (state.isDirty) {
        saveDraft();
      }
    }, autoSaveInterval);
  }, [autoSaveEnabled, articleId, autoSaveInterval, saveDraft, state.isDirty]);

  // Disable auto-save cleanup
  const disableAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);

  // Reset
  const reset = useCallback(() => {
    setState({
      title: initialTitle,
      content: initialContent,
      isDirty: false,
      isSaving: false,
      isPublishing: false,
      saveStatus: 'idle',
      lastSavedAt: null,
      lastError: null,
    });

    lastSavedRef.current = { title: initialTitle, content: initialContent };
  }, [initialTitle, initialContent]);

  return {
    // State
    ...state,

    // Setters
    setTitle,
    setContent,

    // Actions
    saveDraft,
    publish,
    validateContent,
    reset,

    // Auto-save
    enableAutoSave,
    disableAutoSave,
  };
}
