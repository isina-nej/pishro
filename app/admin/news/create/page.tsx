'use client';

/**
 * News Article Creation Page
 * Demo page showing NewsEditor in action
 */

import React, { useState } from 'react';
import { NewsEditor } from '@/components/news/NewsEditor';

export default function CreateNewsPage() {
  const [savedContent, setSavedContent] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
        color: isDarkMode ? '#f3f4f6' : '#000000',
        padding: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Create News Article
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
              color: isDarkMode ? '#f3f4f6' : '#000000',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Editor */}
        <div style={{ marginBottom: '2rem' }}>
          <NewsEditor
            initialContent={savedContent}
            initialTitle="Enter article title"
            placeholder="Start writing your article..."
            autoSaveEnabled={true}
            darkMode={isDarkMode}
            onContentChange={(content) => {
              setSavedContent(content);
            }}
            onSave={(data) => {
              console.log('Article saved:', data);
            }}
          />
        </div>

        {/* Preview Section */}
        {savedContent && (
          <div
            style={{
              marginTop: '3rem',
              padding: '2rem',
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              borderRadius: '0.5rem',
              border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Preview
            </h2>
            <div
              style={{
                fontSize: '0.875rem',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
                marginBottom: '1rem',
              }}
            >
              <p>
                <strong>Content Length:</strong> {savedContent.length} characters
              </p>
            </div>
            <div
              style={{
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                padding: '1rem',
                borderRadius: '0.375rem',
                overflow: 'auto',
                maxHeight: '300px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
              }}
            >
              <pre>{savedContent}</pre>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: isDarkMode ? '#1f2937' : '#e0f2fe',
            borderRadius: '0.5rem',
            border: `1px solid ${isDarkMode ? '#374151' : '#bae6fd'}`,
            color: isDarkMode ? '#e0f2fe' : '#0369a1',
          }}
        >
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            💡 Editor Features:
          </h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
            <li>Text formatting (Bold, Italic, Underline, Strikethrough)</li>
            <li>Heading levels (H1, H2, H3)</li>
            <li>Lists (Ordered and Unordered)</li>
            <li>Code blocks with syntax highlighting</li>
            <li>Image insertion</li>
            <li>Links and block quotes</li>
            <li>Auto-save every 30 seconds</li>
            <li>Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+K, etc.)</li>
            <li>Dark mode support</li>
            <li>Context menu (right-click)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
