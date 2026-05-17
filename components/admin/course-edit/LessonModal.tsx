'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { uploadTempFile } from '@/lib/hooks/useAdminCourses';
import {
  THUMBNAIL_MAX_BYTES,
  ALLOWED_THUMBNAIL_TYPES,
  ALLOWED_VIDEO_TYPE,
  VIDEO_MAX_BYTES,
} from '@/lib/schemas/course-management-schema';

interface Chapter {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  durationSeconds?: number;
  chapterId?: string;
}

interface LessonModalProps {
  isOpen: boolean;
  lesson: Lesson | null;
  chapters: Chapter[];
  hasChapters: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
}

export default function LessonModal({
  isOpen,
  lesson,
  chapters,
  hasChapters,
  onClose,
  onSubmit,
  isLoading,
}: LessonModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationSeconds: '',
    chapterId: '',
  });
  const [thumbnailTempPath, setThumbnailTempPath] = useState<string | null>(null);
  const [videoTempPath, setVideoTempPath] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        durationSeconds: String(lesson.durationSeconds ?? ''),
        chapterId: lesson.chapterId || '',
      });
    } else {
      setFormData({ title: '', description: '', durationSeconds: '', chapterId: '' });
    }
    setThumbnailTempPath(null);
    setVideoTempPath(null);
    setErrors({});
  }, [lesson, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'نام درس الزامی است';
    if (formData.title.length > 200) newErrors.title = 'حداکثر 200 کاراکتر';
    const dur = Number(formData.durationSeconds);
    if (!formData.durationSeconds || !Number.isInteger(dur) || dur <= 0) {
      newErrors.durationSeconds = 'مدت زمان باید عدد صحیح مثبت باشد';
    }
    if (!lesson && !videoTempPath) {
      newErrors.video = 'ویدیو الزامی است';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      durationSeconds: parseInt(formData.durationSeconds, 10),
      chapterId: hasChapters && formData.chapterId ? formData.chapterId : undefined,
      ...(thumbnailTempPath ? { thumbnailTempPath } : {}),
      ...(videoTempPath ? { videoTempPath } : {}),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lesson ? 'ویرایش درس' : 'درس جدید'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">نام درس</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              maxLength={200}
              aria-label="نام درس"
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">مدت (ثانیه)</label>
            <input
              type="number"
              min={1}
              value={formData.durationSeconds}
              onChange={(e) =>
                setFormData((p) => ({ ...p, durationSeconds: e.target.value }))
              }
              aria-label="مدت زمان به ثانیه"
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.durationSeconds && (
              <p className="text-red-500 text-sm">{errors.durationSeconds}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">توضیحات</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
              aria-label="توضیحات درس"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {hasChapters && chapters.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">فصل</label>
              <select
                value={formData.chapterId}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, chapterId: e.target.value }))
                }
                disabled={!hasChapters}
                aria-label="انتخاب فصل"
                className="w-full px-4 py-2 border rounded-lg"
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

          <div>
            <label className="block text-sm font-medium mb-2">تصویر (JPEG/PNG)</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              aria-label="آپلود تصویر درس"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (!ALLOWED_THUMBNAIL_TYPES.includes(f.type as 'image/jpeg' | 'image/png')) {
                  setErrors((err) => ({ ...err, thumbnail: 'JPEG یا PNG' }));
                  return;
                }
                if (f.size > THUMBNAIL_MAX_BYTES) {
                  setErrors((err) => ({ ...err, thumbnail: 'حداکثر 2MB' }));
                  return;
                }
                setThumbnailTempPath(await uploadTempFile(f, 'thumbnail'));
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ویدیو (MP4)</label>
            <input
              type="file"
              accept="video/mp4"
              aria-label="آپلود ویدیو درس"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.type !== ALLOWED_VIDEO_TYPE) {
                  setErrors((err) => ({ ...err, video: 'فقط MP4' }));
                  return;
                }
                if (f.size > VIDEO_MAX_BYTES) {
                  setErrors((err) => ({ ...err, video: 'حداکثر 500MB' }));
                  return;
                }
                setVideoTempPath(await uploadTempFile(f, 'video'));
              }}
            />
            {errors.video && <p className="text-red-500 text-sm">{errors.video}</p>}
          </div>

          {lesson?.id && (
            <div>
              <label className="block text-sm font-medium mb-2">پیش‌نمایش</label>
              <video
                controls
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full rounded-lg"
                aria-label="پیش‌نمایش ویدیو درس"
              >
                <source src={`/api/admin/lessons/${lesson.id}/stream`} type="video/mp4" />
              </video>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isLoading} aria-label="انصراف">
              انصراف
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} aria-label="ذخیره درس">
              {isLoading ? 'درحال پردازش...' : lesson ? 'ذخیره' : 'ایجاد'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
