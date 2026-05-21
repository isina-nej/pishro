'use client';

/**
 * Block Type Selector Component
 * Dropdown menu to select text block type (paragraph, headings, quote, code block)
 */

import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import styles from '@/styles/editor.module.css';

interface BlockTypeSelectorProps {
  editor: Editor | null;
  darkMode?: boolean;
}

interface BlockTypeOption {
  label: string;
  value: string;
  command: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}

const BLOCK_TYPES: BlockTypeOption[] = [
  {
    label: 'Paragraph',
    value: 'paragraph',
    command: (editor) => editor.chain().focus().setParagraph().run(),
    isActive: (editor) => editor.isActive('paragraph'),
  },
  {
    label: 'Heading 1',
    value: 'h1',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  {
    label: 'Heading 2',
    value: 'h2',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    label: 'Heading 3',
    value: 'h3',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    label: 'Quote',
    value: 'blockquote',
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
  },
  {
    label: 'Code Block',
    value: 'code-block',
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
  },
];

export const BlockTypeSelector: React.FC<BlockTypeSelectorProps> = ({
  editor,
  darkMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeType, setActiveType] = useState('paragraph');

  // Update active type when editor selection changes
  useEffect(() => {
    if (!editor) return;

    const updateActiveType = () => {
      const activeOption = BLOCK_TYPES.find((type) => type.isActive(editor));
      if (activeOption) {
        setActiveType(activeOption.label);
      }
    };

    editor.on('selectionUpdate', updateActiveType);
    editor.on('update', updateActiveType);

    return () => {
      editor.off('selectionUpdate', updateActiveType);
      editor.off('update', updateActiveType);
    };
  }, [editor]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!editor) return null;

  const handleSelectType = (blockType: BlockTypeOption) => {
    blockType.command(editor);
    setActiveType(blockType.label);
    setIsOpen(false);
  };

  const dropdownClasses = [
    styles.blockTypeSelector,
    darkMode ? styles.dark : '',
  ]
    .filter(Boolean)
    .join(' ');

  const buttonClasses = [
    styles.blockTypeSelectorButton,
    darkMode ? styles.dark : '',
  ]
    .filter(Boolean)
    .join(' ');

  const menuClasses = [
    styles.blockTypeSelectorMenu,
    isOpen ? styles.open : '',
    darkMode ? styles.dark : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={dropdownClasses} ref={dropdownRef}>
      <button
        className={buttonClasses}
        onClick={() => setIsOpen(!isOpen)}
        title="Select block type"
        type="button"
      >
        <span>{activeType}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={menuClasses}>
          {BLOCK_TYPES.map((blockType) => (
            <button
              key={blockType.value}
              className={[
                styles.blockTypeSelectorOption,
                blockType.isActive(editor) ? styles.active : '',
                darkMode ? styles.dark : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleSelectType(blockType)}
              type="button"
            >
              <span>{blockType.label}</span>
              {blockType.isActive(editor) && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5 4L6 11.5L2.5 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockTypeSelector;
