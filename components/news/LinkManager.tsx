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

  if (!editor) return null;

  // Check if editor has link at cursor
  const hasLink = editor.isActive('link');

  // Get current link data
  const getCurrentLink = useCallback(() => {
    if (!hasLink) return null;

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
    if (confirm('Remove this link?')) {
      editor.chain().focus().unsetLink().run();
      setIsOpen(false);
    }
  }, [editor]);

  // Update link data
  const updateLinkData = (updates: Partial<LinkData>) => {
    setLinkData((prev) => ({ ...prev, ...updates }));
  };

  const buttonClasses = [
    'px-3 py-2 text-sm rounded transition-colors',
    hasLink
      ? 'bg-blue-500 text-white'
      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    darkMode ? 'dark:bg-gray-700' : '',
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md ${
              darkMode ? 'dark:bg-gray-800' : ''
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'dark:bg-gray-700 dark:border-gray-600' : ''
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'dark:bg-gray-700 dark:border-gray-600' : ''
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
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  type="button"
                >
                  Remove
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors ${
                  darkMode ? 'dark:hover:bg-gray-700' : ''
                }`}
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ml-auto"
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
