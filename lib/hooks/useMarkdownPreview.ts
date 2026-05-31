/**
 * useMarkdownPreview Hook
 * Real-time markdown to HTML conversion with debouncing
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { parseMarkdown, validateMarkdown } from '@/lib/markdown-processor';

interface UseMarkdownPreviewResult {
  markdown: string;
  html: string;
  error: string | null;
  isRendering: boolean;
  setMarkdown: (markdown: string) => void;
  clearError: () => void;
}

/**
 * Hook for real-time markdown preview with debouncing
 * @param initialMarkdown - Initial markdown content
 * @param debounceDelay - Delay in milliseconds for debouncing (default: 300ms)
 * @returns Object with markdown, html, error state and setter functions
 */
export function useMarkdownPreview(
  initialMarkdown: string = '',
  debounceDelay: number = 300
): UseMarkdownPreviewResult {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [html, setHtml] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Render markdown to HTML
  const renderMarkdown = useCallback((content: string) => {
    setIsRendering(true);
    setError(null);

    try {
      // Validate content
      const validation = validateMarkdown(content);
      if (!validation.valid) {
        setError(validation.error || 'Invalid content');
        setHtml('');
        setIsRendering(false);
        return;
      }

      // Parse and sanitize
      const sanitizedHtml = parseMarkdown(content);
      setHtml(sanitizedHtml);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Rendering error: ${errorMessage}`);
      console.error('Markdown rendering error:', err);
    } finally {
      setIsRendering(false);
    }
  }, []);

  // Handle markdown changes with debouncing
  const handleMarkdownChange = useCallback(
    (newMarkdown: string) => {
      setMarkdown(newMarkdown);

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer for debounced rendering
      debounceTimerRef.current = setTimeout(() => {
        renderMarkdown(newMarkdown);
      }, debounceDelay);
    },
    [renderMarkdown, debounceDelay]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Initial render if markdown is provided
  useEffect(() => {
    if (initialMarkdown && !html) {
      renderMarkdown(initialMarkdown);
    }
  }, []); // Run only on mount

  return {
    markdown,
    html,
    error,
    isRendering,
    setMarkdown: handleMarkdownChange,
    clearError,
  };
}
