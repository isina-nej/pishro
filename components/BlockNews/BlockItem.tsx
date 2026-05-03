/**
 * BlockItem Component
 * 
 * Individual block editor with drag handle
 */

'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { ContentBlockResponse } from '@/lib/types/block-news';

interface BlockItemProps {
  block: ContentBlockResponse;
  index: number;
  onUpdate: (content: Record<string, unknown>) => Promise<void>;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
}

export default function BlockItem({
  block,
  index,
  onUpdate,
  onDelete,
  isLoading = false,
}: BlockItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editContent, setEditContent] = useState(block.content);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('خطا در ذخیره:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('آیا از حذف این بلاک اطمینان دارید؟')) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('خطا در حذف:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setEditContent(block.content);
    setIsEditing(false);
  };

  const getBlockLabel = () => {
    const labels: Record<string, string> = {
      TEXT: 'متن',
      HEADING: 'عنوان',
      IMAGE: 'تصویر',
      GALLERY: 'نگارخانه',
      QUOTE: 'نقل‌قول',
      LIST: 'فهرست',
    };
    return labels[block.type] || block.type;
  };

  const getPreview = () => {
    const content = block.content as Record<string, unknown>;
    switch (block.type) {
      case 'TEXT':
        return (content.text as string)?.substring(0, 50) + '...';
      case 'HEADING':
        return (content.text as string)?.substring(0, 50);
      case 'IMAGE':
        return `تصویر: ${(content.alt as string) || '(بدون توضیح)'}`;
      case 'GALLERY':
        return `گالری: ${(content.images as Array<unknown>)?.length || 0} تصویر`;
      case 'QUOTE':
        return (content.text as string)?.substring(0, 50) + '...';
      case 'LIST':
        return `فهرست: ${(content.items as Array<unknown>)?.length || 0} مورد`;
      default:
        return 'بلاک';
    }
  };

  if (!isEditing) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={`p-3 border-l-4 ${isDragging ? 'shadow-lg' : ''}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
              title="بلاک را بکشید"
            >
              <GripVertical className="h-4 w-4" />
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">
                  {index + 1}
                </span>
                <span className="font-medium text-sm">{getBlockLabel()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">{getPreview()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              ویرایش
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading || isDeleting}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Edit Mode
  return (
    <Card ref={setNodeRef} style={style} className="p-4 border-primary/50">
      <div className="space-y-3">
        <h4 className="font-semibold">ویرایش {getBlockLabel()}</h4>

        {/* Block Type Specific Editors */}
        {(block.type === 'TEXT' || block.type === 'QUOTE') && (
          <Textarea
            value={(editContent as Record<string, unknown>).text as string}
            onChange={(e) =>
              setEditContent({ ...editContent, text: e.target.value })
            }
            placeholder="متن را وارد کنید..."
            rows={4}
          />
        )}

        {block.type === 'HEADING' && (
          <>
            <Input
              value={(editContent as Record<string, unknown>).text as string}
              onChange={(e) =>
                setEditContent({ ...editContent, text: e.target.value })
              }
              placeholder="عنوان را وارد کنید..."
            />
            <select
              value={(editContent as Record<string, unknown>).level || 'h2'}
              onChange={(e) =>
                setEditContent({ ...editContent, level: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((level) => (
                <option key={level} value={level}>
                  {level.toUpperCase()}
                </option>
              ))}
            </select>
          </>
        )}

        {block.type === 'IMAGE' && (
          <>
            <Input
              value={(editContent as Record<string, unknown>).url as string}
              onChange={(e) =>
                setEditContent({ ...editContent, url: e.target.value })
              }
              placeholder="آدرس تصویر..."
              type="url"
            />
            <Input
              value={(editContent as Record<string, unknown>).alt as string}
              onChange={(e) =>
                setEditContent({ ...editContent, alt: e.target.value })
              }
              placeholder="متن جایگزین"
            />
            <Textarea
              value={(editContent as Record<string, unknown>).caption as string}
              onChange={(e) =>
                setEditContent({ ...editContent, caption: e.target.value })
              }
              placeholder="توضیح تصویر (اختیاری)"
              rows={2}
            />
          </>
        )}

        {block.type === 'LIST' && (
          <>
            <select
              value={(editContent as Record<string, unknown>).style || 'unordered'}
              onChange={(e) =>
                setEditContent({ ...editContent, style: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="unordered">بدون ترتیب</option>
              <option value="ordered">با ترتیب</option>
            </select>
            <Textarea
              value={((editContent as Record<string, unknown>).items as string[])?.join('\n') || ''}
              onChange={(e) =>
                setEditContent({
                  ...editContent,
                  items: e.target.value.split('\n').filter((i) => i.trim()),
                })
              }
              placeholder="هر سطر یک مورد..."
              rows={4}
            />
          </>
        )}

        {block.type === 'QUOTE' && (
          <Input
            value={(editContent as Record<string, unknown>).author as string}
            onChange={(e) =>
              setEditContent({ ...editContent, author: e.target.value })
            }
            placeholder="نویسنده (اختیاری)"
          />
        )}

        {/* Save/Cancel Buttons */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            انصراف
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'درحال ذخیره...' : 'ذخیره'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
