'use client';

/**
 * ImageUpload Component
 * Modal for uploading and inserting images into articles
 */

import React, { useState, useRef } from 'react';
import { IMAGE_UPLOAD_CONFIG } from '@/lib/editor-config';

interface ImageUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (url: string, alt: string) => void;
  darkMode?: boolean;
}

export function ImageUpload({
  isOpen,
  onClose,
  onUpload,
  darkMode = false,
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!IMAGE_UPLOAD_CONFIG.allowedFormats.includes(file.type as any)) {
      setError('Invalid file type. Please use JPEG, PNG, WebP, or GIF.');
      return;
    }

    // Validate file size
    if (file.size > IMAGE_UPLOAD_CONFIG.maxFileSize) {
      setError(
        `File too large. Maximum size is ${IMAGE_UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB.`
      );
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/news/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUpload(data.url, altText || 'Article image');

      // Reset form
      setSelectedFile(null);
      setAltText('');
      setPreview(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
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
        zIndex: 1001,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          borderRadius: '0.5rem',
          padding: '2rem',
          maxWidth: '32rem',
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
          Upload Image
        </h2>

        {/* Preview */}
        {preview && (
          <div style={{ marginBottom: '1rem' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '0.5rem',
              }}
            />
          </div>
        )}

        {/* File Input */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px dashed #d1d5db',
              borderRadius: '0.5rem',
              backgroundColor: darkMode ? '#374151' : '#f9fafb',
              color: darkMode ? '#f3f4f6' : '#000000',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            {selectedFile ? `✓ ${selectedFile.name}` : 'Click to select image'}
          </button>
        </div>

        {/* Alt Text */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: darkMode ? '#f3f4f6' : '#000000',
              fontWeight: '500',
            }}
          >
            Alt Text (for accessibility)
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe the image..."
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
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '0.375rem',
              backgroundColor: !selectedFile || uploading ? '#d1d5db' : '#3b82f6',
              color: '#ffffff',
              cursor: !selectedFile || uploading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              opacity: !selectedFile || uploading ? 0.6 : 1,
            }}
          >
            {uploading ? 'Uploading...' : 'Upload & Insert'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
