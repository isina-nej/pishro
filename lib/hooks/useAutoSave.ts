/**
 * useAutoSave Hook
 * Handles automatic saving of draft content with debouncing
 */

import { useEffect, useRef, useCallback, useState } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface UseAutoSaveOptions {
  articleId?: string;
  title: string;
  content: string;
  excerpt?: string;
  interval?: number; // Milliseconds, default 30000 (30s)
  onSave?: (response: any) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useAutoSave(options: UseAutoSaveOptions) {
  const {
    articleId,
    title,
    content,
    excerpt,
    interval = 30000,
    onSave,
    onError,
    enabled = true,
  } = options;

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef(content);
  const isSavingRef = useRef(false);

  // Keep refs in sync to avoid dependency cycle
  const titleRef = useRef(title);
  const excerptRef = useRef(excerpt);
  const onSaveRef = useRef(onSave);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    titleRef.current = title;
    excerptRef.current = excerpt;
    onSaveRef.current = onSave;
    onErrorRef.current = onError;
  }, [title, excerpt, onSave, onError]);

  /**
   * Save draft to server
   */
  const saveDraft = useCallback(async () => {
    if (!enabled || isSavingRef.current) return;

    if (!content || !titleRef.current) return;

    // Skip if content hasn't changed
    if (content === lastContentRef.current) return;

    try {
      isSavingRef.current = true;
      setSaveStatus('saving');
      setError(null);

      const response = await fetch('/api/news/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId,
          title: titleRef.current,
          content,
          excerpt: excerptRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`Save failed: ${response.statusText}`);
      }

      const data = await response.json();

      lastContentRef.current = content;
      setLastSavedAt(new Date());
      setSaveStatus('saved');

      onSaveRef.current?.(data);

      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setSaveStatus('error');
      onErrorRef.current?.(error);

      // Retry after 5 seconds on error
      setTimeout(() => {
        setSaveStatus('idle');
      }, 5000);
    } finally {
      isSavingRef.current = false;
    }
  }, [content, articleId, enabled]);

  /**
   * Debounced save - called on content change
   */
  const debouncedSave = useCallback(() => {
    if (!enabled) return;

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      saveDraft();
    }, interval);
  }, [interval, saveDraft, enabled]);

  /**
   * Immediate save (on blur, before navigation)
   */
  const saveNow = useCallback(async () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    return saveDraft();
  }, [saveDraft]);

  // Trigger debounced save on content change
  useEffect(() => {
    debouncedSave();

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [content, debouncedSave]);

  // Save on unmount or before navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (content !== lastContentRef.current) {
        e.preventDefault();
        e.returnValue = '';
        // Try to save immediately
        saveDraft();
      }
    };

    if (enabled) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [content, enabled, saveDraft]);

  // Save on blur
  useEffect(() => {
    const handleBlur = () => {
      saveNow();
    };

    if (enabled) {
      window.addEventListener('blur', handleBlur);
      return () => {
        window.removeEventListener('blur', handleBlur);
      };
    }
  }, [enabled, saveNow]);

  return {
    saveStatus,
    lastSavedAt,
    error,
    saveDraft: saveNow,
    isSaving: saveStatus === 'saving',
    hasSaved: saveStatus === 'saved',
    hasError: saveStatus === 'error',
  };
}

export default useAutoSave;
