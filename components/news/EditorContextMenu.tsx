'use client';

/**
 * EditorContextMenu Component
 * Right-click context menu for the editor with formatting options
 */

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/editor.module.css';

export interface ContextMenuOption {
  label: string;
  icon?: string;
  onClick: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface EditorContextMenuProps {
  position: { x: number; y: number } | null;
  options: ContextMenuOption[];
  onClose: () => void;
  darkMode?: boolean;
}

export function EditorContextMenu({
  position,
  options,
  onClose,
  darkMode = false,
}: EditorContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [visibleOptions, setVisibleOptions] = useState(options);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (position) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [position, onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (position) {
      window.addEventListener('mousedown', handleClickOutside);
      return () => window.removeEventListener('mousedown', handleClickOutside);
    }
  }, [position, onClose]);

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      className={`${styles.contextMenu} ${darkMode ? styles.dark : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {options.map((option, index) => (
        <React.Fragment key={index}>
          {option.divider ? (
            <div
              className={`${styles.contextMenuDivider} ${darkMode ? styles.dark : ''}`}
            />
          ) : (
            <button
              className={`${styles.contextMenuItem} ${darkMode ? styles.dark : ''} ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (!option.disabled) {
                  option.onClick();
                  onClose();
                }
              }}
              disabled={option.disabled}
            >
              {option.icon && <span style={{ marginRight: '0.5rem' }}>{option.icon}</span>}
              {option.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default EditorContextMenu;
