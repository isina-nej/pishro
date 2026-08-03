/**
 * M2 Markdown Editor Component
 * 
 * Professional editor with:
 * - Split view (edit/preview)
 * - Toolbar with formatting buttons
 * - Live preview
 * - Image upload support
 * - Syntax highlighting in preview
 */

'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MarkdownPreview from './MarkdownPreview';
import {
  Bold,
  Italic,
  Code,
  Heading2,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link2,
  Quote,
  Minus,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onImageUpload?: (file: File) => Promise<string>;
  isLoading?: boolean;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'محتوای خود را اینجا بنویسید...',
  className = '',
  onImageUpload,
  isLoading = false,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'متن‌تان';
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    setIsUploadingImage(true);
    try {
      const url = await onImageUpload(file);
      insertMarkdown(`![توضیح تصویر](${url})`);
    } catch (error) {
      console.error('خطا در آپلود تصویر:', error);
      alert('خطا در آپلود تصویر');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const toolbarButtons = [
    {
      label: 'عنوان',
      icon: Heading2,
      onClick: () => insertMarkdown('## ', '\n'),
      title: 'Heading 2',
    },
    {
      label: 'توپرفایی',
      icon: Bold,
      onClick: () => insertMarkdown('**', '**'),
      title: 'Bold',
    },
    {
      label: 'کج',
      icon: Italic,
      onClick: () => insertMarkdown('*', '*'),
      title: 'Italic',
    },
    {
      label: 'کد',
      icon: Code,
      onClick: () => insertMarkdown('`', '`'),
      title: 'Inline Code',
    },
    {
      label: 'لیست',
      icon: List,
      onClick: () => insertMarkdown('- ', '\n'),
      title: 'Unordered List',
    },
    {
      label: 'لیست شماره‌دار',
      icon: ListOrdered,
      onClick: () => insertMarkdown('1. ', '\n'),
      title: 'Ordered List',
    },
    {
      label: 'نقل‌قول',
      icon: Quote,
      onClick: () => insertMarkdown('> ', '\n'),
      title: 'Quote',
    },
    {
      label: 'پیوند',
      icon: Link2,
      onClick: () => insertMarkdown('[متن](https://example.com)'),
      title: 'Link',
    },
    {
      label: 'خط جدا‌کننده',
      icon: Minus,
      onClick: () => insertMarkdown('\n---\n'),
      title: 'Horizontal Line',
    },
  ];

  const codeBlockButtons = [
    { label: 'JavaScript', code: 'javascript' },
    { label: 'Python', code: 'python' },
    { label: 'HTML', code: 'html' },
    { label: 'CSS', code: 'css' },
    { label: 'TypeScript', code: 'typescript' },
    { label: 'SQL', code: 'sql' },
    { label: 'Bash', code: 'bash' },
    { label: 'JSON', code: 'json' },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      {/* Toolbar */}
      <div className="bg-muted border border-border rounded-xl p-2 md:p-3 flex flex-wrap gap-1 md:gap-2">
        {/* Main formatting buttons */}
        <div className="flex gap-1 md:gap-2 flex-wrap">
          {toolbarButtons.map((btn) => (
            <Button
              key={btn.title}
              variant="ghost"
              size="sm"
              onClick={btn.onClick}
              disabled={isLoading || isUploadingImage}
              title={btn.title}
              className="h-8 md:h-9 px-2 md:px-3 hover:bg-muted dark:hover:bg-card"
            >
              <btn.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px bg-muted mx-1" />

        {/* Image upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploadingImage || !onImageUpload}
            title="Upload Image"
            className="h-8 md:h-9 px-2 md:px-3 hover:bg-muted dark:hover:bg-card"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Divider */}
        <div className="w-px bg-muted mx-1" />

        {/* Code block selector */}
        <div className="flex gap-1">
          {codeBlockButtons.slice(0, 3).map((btn) => (
            <Button
              key={btn.code}
              variant="ghost"
              size="sm"
              onClick={() =>
                insertMarkdown(`\`\`\`${btn.code}\n`, '\n\`\`\`')
              }
              disabled={isLoading}
              title={`${btn.label} Code`}
              className="h-8 md:h-9 px-2 text-xs hover:bg-muted dark:hover:bg-card"
            >
              {btn.label}
            </Button>
          ))}
        </div>

        {/* More code blocks dropdown would go here */}
        
        {/* Spacer */}
        <div className="flex-1" />

        {/* Toggle preview */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="h-8 md:h-9 px-2 md:px-3 hover:bg-muted dark:hover:bg-card"
          title={showPreview ? 'Hide Preview' : 'Show Preview'}
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Editor Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
        {/* Editor */}
        <div className="flex flex-col">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 min-h-[400px] md:min-h-[600px] p-4 font-mono text-sm bg-card border-2 border-border rounded-xl resize-none"
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="hidden md:flex flex-col">
            <div className="flex-1 overflow-auto bg-card border-2 border-border rounded-xl p-4 md:p-6">
              <MarkdownPreview content={value} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile preview toggle */}
      {showPreview && (
        <div className="md:hidden bg-card border-2 border-border rounded-xl p-4">
          <h3 className="font-bold mb-4 text-right">پیش‌نمایش:</h3>
          <MarkdownPreview content={value} />
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-muted-foreground text-right bg-primary/20 p-3 rounded-lg border border-primary">
        💡 <strong>نکات:</strong> از Markdown استفاده کنید. توپر: ** متن **، کج: * متن *، کد: ` متن `، لیست: - مورد، لینک: [متن](url)
      </div>
    </div>
  );
}
