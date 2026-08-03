'use client';

/**
 * News Article Creation Page
 * Create new articles with rich text editor
 */

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { NewsEditor } from '@/components/news/NewsEditor';
import { EditorActionBar } from '@/components/news/EditorActionBar';

export default function CreateNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Track content using refs to avoid re-renders
  const editorContentRef = useRef<string>('');
  const lastSavedRef = useRef<{ title: string; content: string }>({ title: '', content: '' });

  // Track unsaved changes
  const handleContentChange = useCallback((content: string) => {
    editorContentRef.current = content;
    // Mark as having unsaved changes (no parent re-render needed)
    if (content !== lastSavedRef.current.content || title !== lastSavedRef.current.title) {
      setHasUnsavedChanges(true);
    }
  }, [title]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (newTitle !== lastSavedRef.current.title || editorContentRef.current !== lastSavedRef.current.content) {
      setHasUnsavedChanges(true);
    }
  }, []);

  // Handle back button
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Handle save draft
  const handleSaveDraft = useCallback(async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/news/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: editorContentRef.current,
          draft: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      await response.json();
      lastSavedRef.current = { title, content: editorContentRef.current };
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      
      // Show success for 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [title]);

  // Handle publish
  const handlePublish = useCallback(async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!editorContentRef.current.trim()) {
      alert('Please write some content');
      return;
    }

    if (!confirm(`Publish article "${title.trim()}"?`)) {
      return;
    }

    setIsPublishing(true);

    try {
      const response = await fetch('/api/news/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: editorContentRef.current,
          draft: false,
          published: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish article');
      }

      await response.json();
      alert('Article published successfully!');
      router.push('/admin/news');
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish article. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  }, [title, router]);

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
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Action Bar */}
        <EditorActionBar
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          isPublishing={isPublishing}
          darkMode={isDarkMode}
        />

        {/* Save Status Message */}
        {saveStatus !== 'idle' && (
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              borderRadius: '0.375rem',
              backgroundColor: saveStatus === 'saved' ? '#d1fae5' : '#fee2e2',
              color: saveStatus === 'saved' ? '#065f46' : '#991b1b',
              fontSize: '0.875rem',
            }}
          >
            {saveStatus === 'saved' ? '✓ Draft saved successfully' : '✗ Error saving draft'}
          </div>
        )}

        {/* Title Input */}
        <div
          style={{
            marginBottom: '1.5rem',
          }}
        >
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: isDarkMode ? '#e5e7eb' : '#000000',
            }}
          >
            Article Title
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter article title..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${isDarkMode ? '#374151' : '#d1d5db'}`,
              borderRadius: '0.375rem',
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#f3f4f6' : '#000000',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Editor */}
        <div style={{ marginBottom: '2rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: isDarkMode ? '#e5e7eb' : '#000000',
            }}
          >
            Article Content
          </label>
          <NewsEditor
            initialContent=""
            initialTitle=""
            placeholder="Start writing your article..."
            autoSaveEnabled={false}
            darkMode={isDarkMode}
            onContentChange={handleContentChange}
            onSave={() => {
              // Not using auto-save
            }}
          />
        </div>

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
            💡 How to use:
          </h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
            <li>Enter a title and write your article content</li>
            <li>Use the formatting toolbar for styling (bold, italic, headings, etc.)</li>
            <li>Click <strong>&quot;Save Draft&quot;</strong> to save without publishing</li>
            <li>Click <strong>&quot;Publish&quot;</strong> to publish the article immediately</li>
            <li>Click <strong>&quot;Back&quot;</strong> to return to the article list</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
