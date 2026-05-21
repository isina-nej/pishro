'use client';

/**
 * LinkDialog Component
 * Dialog for inserting and editing links in articles
 */

import React, { useState, useEffect } from 'react';

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text?: string) => void;
  initialUrl?: string;
  initialText?: string;
  darkMode?: boolean;
}

export function LinkDialog({
  isOpen,
  onClose,
  onInsert,
  initialUrl = '',
  initialText = '',
  darkMode = false,
}: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUrl(initialUrl);
    setText(initialText);
  }, [initialUrl, initialText]);

  const validateUrl = (urlStr: string) => {
    try {
      // Allow relative URLs, mailto, and http(s) URLs
      if (
        urlStr.startsWith('/') ||
        urlStr.startsWith('mailto:') ||
        urlStr.startsWith('tel:') ||
        /^https?:\/\//.test(urlStr)
      ) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleInsert = () => {
    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    if (!validateUrl(url)) {
      setError(
        'Invalid URL. Use http://, https://, /, mailto:, or tel: format.'
      );
      return;
    }

    onInsert(url, text || undefined);
    setUrl('');
    setText('');
    setError(null);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInsert();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          borderRadius: '0.5rem',
          padding: '2rem',
          maxWidth: '28rem',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: darkMode ? '#f3f4f6' : '#000000',
          }}
        >
          Insert Link
        </h2>

        {/* URL Input */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: darkMode ? '#f3f4f6' : '#000000',
              fontWeight: '500',
            }}
          >
            URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com or /path"
            autoFocus
            style={{
              width: '100%',
              padding: '0.5rem',
              border: error ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: darkMode ? '#374151' : '#ffffff',
              color: darkMode ? '#f3f4f6' : '#000000',
            }}
          />
        </div>

        {/* Link Text (Optional) */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: darkMode ? '#f3f4f6' : '#000000',
              fontWeight: '500',
            }}
          >
            Link Text (optional)
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Display text for link"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: darkMode ? '#374151' : '#ffffff',
              color: darkMode ? '#f3f4f6' : '#000000',
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: darkMode ? '#374151' : '#f9fafb',
              color: darkMode ? '#f3f4f6' : '#000000',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '0.375rem',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Insert Link
          </button>
        </div>
      </div>
    </div>
  );
}

export default LinkDialog;
