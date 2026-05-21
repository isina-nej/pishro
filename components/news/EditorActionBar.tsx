'use client';

/**
 * EditorActionBar Component
 * Provides Back, Save Draft, and Publish buttons for news editor
 */

import React, { useState } from 'react';
import styles from '@/styles/editor.module.css';

export interface EditorActionBarProps {
  onBack?: () => void;
  onSaveDraft?: () => Promise<void>;
  onPublish?: () => void;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
  isPublishing?: boolean;
  darkMode?: boolean;
  disabled?: boolean;
}

export function EditorActionBar({
  onBack,
  onSaveDraft,
  onPublish,
  hasUnsavedChanges = false,
  isSaving = false,
  isPublishing = false,
  darkMode = false,
  disabled = false,
}: EditorActionBarProps) {
  const [showBackWarning, setShowBackWarning] = useState(false);

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowBackWarning(true);
    } else {
      onBack?.();
    }
  };

  const handleConfirmBack = () => {
    setShowBackWarning(false);
    onBack?.();
  };

  return (
    <>
      {/* Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          marginBottom: '1.5rem',
          borderRadius: '0.375rem',
          gap: '1rem',
        }}
      >
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          disabled={disabled || isSaving || isPublishing}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: darkMode ? '#374151' : '#f3f4f6',
            color: darkMode ? '#f3f4f6' : '#000000',
            border: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
            borderRadius: '0.375rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s',
            opacity: disabled ? 0.5 : 1,
          }}
          onMouseOver={(e) => {
            if (!disabled && !isSaving && !isPublishing) {
              (e.target as HTMLButtonElement).style.backgroundColor = darkMode ? '#4b5563' : '#e5e7eb';
            }
          }}
          onMouseOut={(e) => {
            if (!disabled && !isSaving && !isPublishing) {
              (e.target as HTMLButtonElement).style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
            }
          }}
        >
          ← Back
        </button>

        {/* Right Side Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
          {/* Save Draft Button */}
          <button
            onClick={onSaveDraft}
            disabled={disabled || isSaving || isPublishing || !hasUnsavedChanges}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: darkMode ? '#3b82f6' : '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: disabled || !hasUnsavedChanges ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s',
              opacity: disabled || !hasUnsavedChanges ? 0.5 : 1,
            }}
            onMouseOver={(e) => {
              if (!disabled && hasUnsavedChanges) {
                (e.target as HTMLButtonElement).style.backgroundColor = darkMode ? '#2563eb' : '#2563eb';
              }
            }}
            onMouseOut={(e) => {
              if (!disabled && hasUnsavedChanges) {
                (e.target as HTMLButtonElement).style.backgroundColor = darkMode ? '#3b82f6' : '#3b82f6';
              }
            }}
          >
            {isSaving ? '💾 Saving...' : hasUnsavedChanges ? '💾 Save Draft' : '✓ Saved'}
          </button>

          {/* Publish Button */}
          <button
            onClick={onPublish}
            disabled={disabled || isSaving || isPublishing}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: darkMode ? '#10b981' : '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s',
              opacity: disabled ? 0.5 : 1,
            }}
            onMouseOver={(e) => {
              if (!disabled) {
                (e.target as HTMLButtonElement).style.backgroundColor = darkMode ? '#059669' : '#059669';
              }
            }}
            onMouseOut={(e) => {
              if (!disabled) {
                (e.target as HTMLButtonElement).style.backgroundColor = darkMode ? '#10b981' : '#10b981';
              }
            }}
          >
            {isPublishing ? '📤 Publishing...' : '📤 Publish'}
          </button>
        </div>
      </div>

      {/* Back Confirmation Dialog */}
      {showBackWarning && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowBackWarning(false)}
        >
          <div
            style={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderRadius: '0.5rem',
              padding: '2rem',
              maxWidth: '400px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: darkMode ? '#f3f4f6' : '#000000',
              }}
            >
              Discard Changes?
            </h3>
            <p
              style={{
                marginBottom: '1.5rem',
                color: darkMode ? '#d1d5db' : '#6b7280',
              }}
            >
              You have unsaved changes. Are you sure you want to go back? Your changes will be lost if you haven't published them.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowBackWarning(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#f3f4f6' : '#000000',
                  border: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBack}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
