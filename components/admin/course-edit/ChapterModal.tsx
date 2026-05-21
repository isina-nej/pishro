// @/components/admin/course-edit/ChapterModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Chapter {
  id: string;
  title: string;
  position: number;
}

interface ChapterModalProps {
  isOpen: boolean;
  chapter: Chapter | null;
  onClose: () => void;
  onSubmit: (data: { title: string }) => Promise<void>;
  isLoading: boolean;
}

export default function ChapterModal({
  isOpen,
  chapter,
  onClose,
  onSubmit,
  isLoading,
}: ChapterModalProps) {
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title);
    } else {
      setTitle('');
    }
    setErrors({});
  }, [chapter, isOpen]);

  const validate = (): boolean => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'نام فصل الزامی است';
    } else if (title.length > 200) {
      newErrors.title = 'نام فصل نمی‌تواند بیش از 200 کاراکتر باشد';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onSubmit({ title: title.trim() });
      setTitle('');
      setErrors({});
      onClose();
    } catch (error) {
      // Error handling is done in the parent component via toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-right">
        <DialogHeader>
          <DialogTitle className="text-right">
            {chapter ? 'ویرایش فصل' : 'فصل جدید'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">نام فصل</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="نام فصل را وارد کنید"
              maxLength={200}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-borderColor focus:ring-blue-500'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              {title.length}/200
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4 flex-row-reverse">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              انصراف
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'درحال پردازش...' : chapter ? 'ذخیره' : 'ایجاد'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
