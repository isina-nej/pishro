'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  uploadTempFile,
  useUpdateAdminCourse,
} from '@/lib/hooks/useAdminCourses';
import {
  THUMBNAIL_MAX_BYTES,
  ALLOWED_THUMBNAIL_TYPES,
  ALLOWED_VIDEO_TYPE,
  VIDEO_MAX_BYTES,
} from '@/lib/schemas/course-management-schema';
import { toast } from 'react-hot-toast';

export interface CourseBasicTabData {
  id: string;
  subject: string;
  price: number;
  description?: string;
  categoryId?: string;
  instructor?: string;
  level?: string;
  hasChapters: boolean;
  published: boolean;
  featured: boolean;
  status: string;
  likes?: number;
  dislikes?: number;
  img?: string;
  introVideoUrl?: string;
}

interface CourseBasicTabProps {
  course: CourseBasicTabData;
  onUpdate: React.Dispatch<React.SetStateAction<CourseBasicTabData | null>>;
}

export default function CourseBasicTab({ course, onUpdate }: CourseBasicTabProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(course);
  const [thumbnailTempPath, setThumbnailTempPath] = useState<string | null>(null);
  const [trailerTempPath, setTrailerTempPath] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateMutation = useUpdateAdminCourse();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? Number(value)
            : value,
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.subject?.trim()) next.subject = 'عنوان الزامی است';
    if (formData.subject && formData.subject.length > 200) {
      next.subject = 'عنوان نباید بیشتر از 200 کاراکتر باشد';
    }
    if (formData.price < 0) next.price = 'قیمت باید عدد نامنفی باشد';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleThumbnail = async (file: File) => {
    if (!ALLOWED_THUMBNAIL_TYPES.includes(file.type as 'image/jpeg' | 'image/png')) {
      setErrors((e) => ({ ...e, thumbnail: 'فرمت JPEG یا PNG' }));
      return;
    }
    if (file.size > THUMBNAIL_MAX_BYTES) {
      setErrors((e) => ({ ...e, thumbnail: 'حداکثر 2MB' }));
      return;
    }
    try {
      const path = await uploadTempFile(file, 'thumbnail');
      setThumbnailTempPath(path);
      setErrors((e) => ({ ...e, thumbnail: '' }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'خطا در آپلود تصویر';
      setErrors((e) => ({ ...e, thumbnail: message }));
      toast.error(message);
    }
  };

  const handleTrailer = async (file: File) => {
    if (file.type !== ALLOWED_VIDEO_TYPE) {
      setErrors((e) => ({ ...e, trailer: 'فقط MP4' }));
      return;
    }
    if (file.size > VIDEO_MAX_BYTES) {
      setErrors((e) => ({ ...e, trailer: 'حداکثر 500MB' }));
      return;
    }
    try {
      const path = await uploadTempFile(file, 'video');
      setTrailerTempPath(path);
      setErrors((e) => ({ ...e, trailer: '' }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'خطا در آپلود ویدیو';
      setErrors((e) => ({ ...e, trailer: message }));
      toast.error(message);
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const updated = await updateMutation.mutateAsync({
        id: course.id,
        data: {
          title: formData.subject,
          cost: formData.price,
          description: formData.description,
          categoryId: formData.categoryId,
          instructor: formData.instructor,
          hasChapters: formData.hasChapters,
          published: formData.published,
          featured: formData.featured,
          likes: formData.likes ?? 0,
          dislikes: formData.dislikes ?? 0,
          ...(thumbnailTempPath ? { thumbnailTempPath } : {}),
          ...(trailerTempPath ? { trailerTempPath } : {}),
        },
      });
      onUpdate(updated);
      setThumbnailTempPath(null);
      setTrailerTempPath(null);
      toast.success('دوره با موفقیت ذخیره شد');
      // برگشت به لیست دوره‌ها بعد از 1 ثانیه
      setTimeout(() => {
        router.push('/admin/courses');
      }, 1000);
    } catch (error) {
      toast.error('خطا در ذخیره دوره');
      console.error('Save error:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-cardBg rounded-lg shadow p-6 mt-6 text-right">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">نام دوره</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            maxLength={200}
            aria-label="نام دوره"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">قیمت</label>
            <input
              type="number"
              name="price"
              min={0}
              max={2147483647}
              value={formData.price}
              onChange={handleChange}
              aria-label="قیمت دوره"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">لایک</label>
            <input
              type="number"
              name="likes"
              min={0}
              value={formData.likes ?? 0}
              onChange={handleChange}
              aria-label="تعداد لایک"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">دیسلایک</label>
            <input
              type="number"
              name="dislikes"
              min={0}
              value={formData.dislikes ?? 0}
              onChange={handleChange}
              aria-label="تعداد دیسلایک"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">توضیحات</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            aria-label="توضیحات دوره"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">تصویر شاخص (JPEG/PNG, max 2MB)</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            aria-label="آپلود تصویر شاخص"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleThumbnail(f);
            }}
          />
          {thumbnailTempPath && <p className="text-sm text-green-600">فایل آماده ذخیره</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">ویدیو معرفی (MP4, max 500MB)</label>
          <input
            type="file"
            accept="video/mp4"
            aria-label="آپلود ویدیو معرفی"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleTrailer(f);
            }}
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="hasChapters"
            checked={formData.hasChapters}
            onChange={handleChange}
            aria-label="استفاده از فصل‌ها"
          />
          <span className="text-sm">استفاده از فصل‌ها</span>
        </label>

        <Button onClick={handleSave} disabled={updateMutation.isPending} aria-label="ذخیره دوره">
          {updateMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
        </Button>
      </div>
    </div>
  );
}
