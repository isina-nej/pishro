'use client';

/**
 * Link Management Component
 * Edit and remove links from editor
 */

import React, { useState, useCallback } from 'react';
import type { Editor } from '@tiptap/react';

export interface LinkManagerProps {
  editor: Editor | null;
  darkMode?: boolean;
}

export interface LinkData {
  url: string;
  text: string;
  isNewWindow: boolean;
}

export const LinkManager: React.FC<LinkManagerProps> = ({ editor, darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [linkData, setLinkData] = useState<LinkData>({
    url: '',
    text: '',
    isNewWindow: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Check if editor has link at cursor
  const hasLink = editor?.isActive('link') ?? false;

  // Get current link data
  const getCurrentLink = useCallback(() => {
    if (!editor || !hasLink) return null;

    const { from, to } = editor.view.state.selection;
    const node = editor.view.state.doc.cut(from, to);
    const mark = node.marks[0];

    if (mark && mark.type.name === 'link') {
      return {
        url: mark.attrs.href || '',
        text: node.textContent,
        isNewWindow: mark.attrs.target === '_blank',
      };
    }

    return null;
  }, [editor, hasLink]);

  // Open link manager
  const handleOpen = useCallback(() => {
    const current = getCurrentLink();
    if (current) {
      setLinkData(current);
      setIsEditing(true);
    } else {
      setLinkData({ url: '', text: '', isNewWindow: false });
      setIsEditing(false);
    }
    setIsOpen(true);
  }, [getCurrentLink]);

  // Save link
  const handleSave = useCallback(() => {
    if (!editor) return;

    if (!linkData.url || !linkData.text) {
      alert('Please fill in both URL and link text');
      return;
    }

    editor
      .chain()
      .focus()
      .setLink({
        href: linkData.url,
        target: linkData.isNewWindow ? '_blank' : null,
      })
      .run();

    setIsOpen(false);
  }, [editor, linkData]);

  // Remove link
  const handleRemove = useCallback(() => {
    if (!editor) return;

    if (confirm('Remove this link?')) {
      editor.chain().focus().unsetLink().run();
      setIsOpen(false);
    }
  }, [editor]);

  // Update link data
  const updateLinkData = (updates: Partial<LinkData>) => {
    setLinkData((prev) => ({ ...prev, ...updates }));
  };

  // Hooks above must run unconditionally - bail out only after they are declared
  if (!editor) return null;

  const buttonClasses = [
    'px-3 py-2 text-sm rounded transition-colors',
    hasLink
      ? 'bg-primary text-primary-foreground'
      : 'bg-muted text-muted-foreground',
    darkMode ? '' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <button
        onClick={handleOpen}
        className={buttonClasses}
        title="Manage link"
        type="button"
        disabled={!hasLink && !editor.isActive('link')}
      >
        🔗 Link
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`bg-card rounded-lg shadow-lg p-6 w-full max-w-md ${
              darkMode ? '' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">
              {isEditing ? 'Edit Link' : 'Insert Link'}
            </h3>

            <div className="space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="url"
                  value={linkData.url}
                  onChange={(e) => updateLinkData({ url: e.target.value })}
                  placeholder="https://example.com"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    darkMode ? '' : ''
                  }`}
                />
              </div>

              {/* Link Text */}
              <div>
                <label className="block text-sm font-medium mb-1">Link Text</label>
                <input
                  type="text"
                  value={linkData.text}
                  onChange={(e) => updateLinkData({ text: e.target.value })}
                  placeholder="Link text"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    darkMode ? '' : ''
                  }`}
                />
              </div>

              {/* Open in New Window */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newWindow"
                  checked={linkData.isNewWindow}
                  onChange={(e) => updateLinkData({ isNewWindow: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="newWindow" className="text-sm cursor-pointer">
                  Open in new window
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              {isEditing && (
                <button
                  onClick={handleRemove}
                  className="px-4 py-2 bg-destructive text-primary-foreground rounded-md hover:bg-destructive transition-colors"
                  type="button"
                >
                  Remove
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2 border rounded-md hover:bg-muted transition-colors ${
                  darkMode ? 'dark:hover:bg-accent' : ''
                }`}
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary transition-colors ml-auto"
                type="button"
              >
                {isEditing ? 'Update' : 'Insert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkManager;
