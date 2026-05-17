// @/components/admin/course-edit/LessonModal.tsx
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
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  chapterId?: string;
}

interface LessonModalProps {
  isOpen: boolean;
  lesson: Lesson | null;
  chapters: Chapter[];
  courseId: string;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export default function LessonModal({
  isOpen,
  lesson,
  chapters,
  courseId,
  onClose,
  onSubmit,
  isLoading,
}: LessonModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    chapterId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        duration: lesson.duration || '',
        chapterId: lesson.chapterId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        duration: '',
        chapterId: '',
      });
    }
    setErrors({});
  }, [lesson, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'نام درس الزامی است';
    }
    if (!formData.duration) {
      newErrors.duration = 'مدت زمان الزامی است';
    } else if (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      newErrors.duration = 'مدت زمان باید عدد مثبت باشد';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: parseInt(formData.duration),
        chapterId: formData.chapterId || undefined,
      });
      setFormData({
        title: '',
        description: '',
        duration: '',
        chapterId: '',
      });
      setErrors({});
      onClose();
    } catch (error) {
      // Error handling is done in the parent component via toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {lesson ? 'ویرایش درس' : 'درس جدید'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">نام درس</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="نام درس را وارد کنید"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-borderColor focus:ring-blue-500'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">مدت زمان (ثانیه)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="0"
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.duration
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-borderColor focus:ring-blue-500'
              }`}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="توضیحات درس (اختیاری)"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {chapters.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">فصل</label>
              <select
                name="chapterId"
                value={formData.chapterId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">بدون فصل</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              انصراف
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'درحال پردازش...' : lesson ? 'ذخیره' : 'ایجاد'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
