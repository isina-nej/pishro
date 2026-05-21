/**
 * Hook: useDraftRestoration
 * Manages draft restoration logic
 * Location: lib/hooks/useDraftRestoration.ts
 */

import { useEffect, useState, useCallback } from 'react';

interface DraftData {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  lastEditedAt: string;
}

interface UseDraftRestorationOptions {
  articleId?: string;
  onError?: (error: Error) => void;
}

interface UseDraftRestorationReturn {
  draft: DraftData | null;
  isLoading: boolean;
  error: Error | null;
  discardDraft: () => Promise<void>;
  hasDraft: boolean;
  lastSavedTime: string | null;
}

/**
 * Hook to manage draft restoration
 */
export function useDraftRestoration(options: UseDraftRestorationOptions = {}): UseDraftRestorationReturn {
  const { articleId, onError } = options;
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load draft on mount
  useEffect(() => {
    if (!articleId) return;

    const loadDraft = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/news/draft/${articleId}`);

        if (response.ok) {
          const draftData: DraftData = await response.json();
          setDraft(draftData);
        } else if (response.status !== 404) {
          // 404 means no draft, which is fine
          throw new Error(`Failed to load draft: ${response.statusText}`);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        if (onError) {
          onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [articleId, onError]);

  // Discard draft function
  const discardDraft = useCallback(async () => {
    if (!articleId) return;

    try {
      const response = await fetch(`/api/news/draft/${articleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete draft: ${response.statusText}`);
      }

      setDraft(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (onError) {
        onError(error);
      }
      throw error;
    }
  }, [articleId, onError]);

  // Parse last edited time for display
  const lastSavedTime = draft?.lastEditedAt
    ? new Date(draft.lastEditedAt).toLocaleString()
    : null;

  return {
    draft,
    isLoading,
    error,
    discardDraft,
    hasDraft: draft !== null,
    lastSavedTime,
  };
}
