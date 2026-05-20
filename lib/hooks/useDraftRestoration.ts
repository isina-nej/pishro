/**
 * Hook: useDraftRestoration
 * Automatically loads and restores article drafts on page load
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
  onDraftFound?: (draft: DraftData) => void;
  onDraftLoaded?: (data: { title: string; content: string; excerpt?: string }) => void;
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
 * - Checks for existing draft on mount
 * - Notifies if draft is found
 * - Provides function to discard draft
 */
export function useDraftRestoration(options: UseDraftRestorationOptions = {}): UseDraftRestorationReturn {
  const { articleId, onDraftFound, onDraftLoaded, onError } = options;
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

          // Call callback to notify parent component
          if (onDraftFound) {
            onDraftFound(draftData);
          }

          // Auto-load draft content if callback provided
          if (onDraftLoaded) {
            onDraftLoaded({
              title: draftData.title,
              content: draftData.content,
              excerpt: draftData.excerpt,
            });
          }
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
  }, [articleId, onDraftFound, onDraftLoaded, onError]);

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

/**
 * Helper component: DraftRestorationNotice
 * Displays notification when draft is found
 */
interface DraftRestorationNoticeProps {
  draft: DraftData | null;
  isLoading: boolean;
  lastSavedTime: string | null;
  onDiscard?: () => void;
  onRestore?: () => void;
  darkMode?: boolean;
}

export function DraftRestorationNotice({
  draft,
  isLoading,
  lastSavedTime,
  onDiscard,
  onRestore,
  darkMode,
}: DraftRestorationNoticeProps) {
  const [dismissed, setDismissed] = useState(false);

  if (isLoading || !draft || dismissed) return null;

  const containerStyle: React.CSSProperties = {
    padding: '12px 16px',
    marginBottom: '16px',
    backgroundColor: darkMode ? '#1f2937' : '#f0fdf4',
    border: `1px solid ${darkMode ? '#374151' : '#86efac'}`,
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: darkMode ? '#e5e7eb' : '#15803d',
    fontSize: '14px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '4px 12px',
    marginLeft: '8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  };

  const restoreButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: darkMode ? '#059669' : '#22c55e',
    color: 'white',
  };

  const discardButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: darkMode ? '#6b7280' : '#e5e7eb',
    color: darkMode ? '#f3f4f6' : '#1f2937',
  };

  const dismissButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: 'none',
    color: darkMode ? '#9ca3af' : '#6b7280',
    padding: '0 4px',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <div>
        <strong>Draft Found!</strong>
        {lastSavedTime && (
          <>
            {' '}Last saved: <em>{lastSavedTime}</em>
          </>
        )}
      </div>
      <div>
        <button
          onClick={onRestore}
          style={restoreButtonStyle}
          title="Use the saved draft"
        >
          Use Draft
        </button>
        <button
          onClick={() => {
            onDiscard?.();
            setDismissed(true);
          }}
          style={discardButtonStyle}
          title="Discard this draft and start fresh"
        >
          Discard
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={dismissButtonStyle}
          title="Dismiss this notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
