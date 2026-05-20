'use client';

/**
 * Image Manager Component
 * Edit, resize, and delete images from editor
 */

import React, { useState, useCallback } from 'react';
import type { Editor } from '@tiptap/react';

export interface ImageManagerProps {
  editor: Editor | null;
  darkMode?: boolean;
}

export interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export const ImageManager: React.FC<ImageManagerProps> = ({ editor, darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageData, setImageData] = useState<ImageData>({
    src: '',
    alt: '',
    width: 100,
    height: 100,
    aspectRatio: 1,
  });

  if (!editor) return null;

  // Get current image data
  const getCurrentImage = useCallback(() => {
    const { node } = editor.getAttributes('image');
    if (!node) return null;

    return {
      src: node.src || '',
      alt: node.alt || '',
      width: node.width || 100,
      height: node.height || 100,
      aspectRatio: (node.width || 100) / (node.height || 100),
    };
  }, [editor]);

  // Open image manager
  const handleOpen = useCallback(() => {
    const current = getCurrentImage();
    if (current) {
      setImageData(current);
    } else {
      setImageData({
        src: '',
        alt: '',
        width: 100,
        height: 100,
        aspectRatio: 1,
      });
    }
    setIsOpen(true);
  }, [getCurrentImage]);

  // Update image
  const handleSave = useCallback(() => {
    if (!imageData.src) {
      alert('Please enter image URL');
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({
        src: imageData.src,
        alt: imageData.alt,
        width: imageData.width,
        height: imageData.height,
      })
      .run();

    setIsOpen(false);
  }, [editor, imageData]);

  // Delete image
  const handleDelete = useCallback(() => {
    if (confirm('Delete this image?')) {
      editor.chain().focus().deleteSelection().run();
      setIsOpen(false);
    }
  }, [editor]);

  // Update width (maintain aspect ratio)
  const updateWidth = (newWidth: number) => {
    const newHeight = Math.round(newWidth / imageData.aspectRatio);
    setImageData((prev) => ({
      ...prev,
      width: newWidth,
      height: newHeight,
    }));
  };

  // Update height (maintain aspect ratio)
  const updateHeight = (newHeight: number) => {
    const newWidth = Math.round(newHeight * imageData.aspectRatio);
    setImageData((prev) => ({
      ...prev,
      width: newWidth,
      height: newHeight,
    }));
  };

  // Reset to original size
  const resetSize = () => {
    // For now, reset to 300x225 (4:3 ratio)
    setImageData((prev) => ({
      ...prev,
      width: 300,
      height: 225,
    }));
  };

  const buttonClasses = [
    'px-3 py-2 text-sm rounded transition-colors',
    editor.isActive('image')
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
        title="Manage image"
        type="button"
        disabled={!editor.isActive('image')}
      >
        🖼️ Image
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-96 overflow-y-auto ${
              darkMode ? 'dark:bg-gray-800' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Edit Image</h3>

            <div className="space-y-4">
              {/* Image Preview */}
              {imageData.src && (
                <div
                  className={`w-full bg-gray-100 rounded-md overflow-hidden flex items-center justify-center ${
                    darkMode ? 'dark:bg-gray-700' : ''
                  }`}
                  style={{ height: `${Math.min(imageData.height, 200)}px` }}
                >
                  <img
                    src={imageData.src}
                    alt={imageData.alt}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}

              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="url"
                  value={imageData.src}
                  onChange={(e) => setImageData((prev) => ({ ...prev, src: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'dark:bg-gray-700 dark:border-gray-600' : ''
                  }`}
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium mb-1">Alt Text</label>
                <input
                  type="text"
                  value={imageData.alt}
                  onChange={(e) => setImageData((prev) => ({ ...prev, alt: e.target.value }))}
                  placeholder="Image description"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'dark:bg-gray-700 dark:border-gray-600' : ''
                  }`}
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={imageData.width}
                    onChange={(e) => updateWidth(parseInt(e.target.value))}
                    min="50"
                    max="1920"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'dark:bg-gray-700 dark:border-gray-600' : ''
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={imageData.height}
                    onChange={(e) => updateHeight(parseInt(e.target.value))}
                    min="50"
                    max="1920"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'dark:bg-gray-700 dark:border-gray-600' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Aspect Ratio Info */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Aspect Ratio: {imageData.aspectRatio.toFixed(2)}:1
              </div>

              {/* Reset Button */}
              <button
                onClick={resetSize}
                className={`w-full px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors ${
                  darkMode ? 'dark:hover:bg-gray-700' : ''
                }`}
                type="button"
              >
                Reset to Default Size
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                type="button"
              >
                Delete
              </button>
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageManager;
