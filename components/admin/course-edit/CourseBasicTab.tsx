'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  rating?: number | null;
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
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [trailerTempPath, setTrailerTempPath] = useState<string | null>(null);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [trailerUploading, setTrailerUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const updateMutation = useUpdateAdminCourse();

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

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
            ? value === ''
              ? undefined
              : Number(value)
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
    if (
      formData.rating !== undefined &&
      formData.rating !== null &&
      (Number.isNaN(formData.rating) || formData.rating < 0 || formData.rating > 5)
    ) {
      next.rating = 'امتیاز باید بین ۰ تا ۵ باشد';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleThumbnail = async (file: File) => {
    if (!ALLOWED_THUMBNAIL_TYPES.includes(file.type as 'image/jpeg' | 'image/png' | 'image/webp')) {
      setErrors((e) => ({ ...e, thumbnail: 'فرمت JPEG، PNG یا WebP' }));
      return;
    }
    if (file.size > THUMBNAIL_MAX_BYTES) {
      setErrors((e) => ({ ...e, thumbnail: 'حداکثر 5MB' }));
      return;
    }
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(URL.createObjectURL(file));
    setThumbnailTempPath(null);
    setThumbUploading(true);
    try {
      const path = await uploadTempFile(file, 'thumbnail');
      setThumbnailTempPath(path);
      setErrors((e) => ({ ...e, thumbnail: '' }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'خطا در آپلود تصویر';
      setErrors((e) => ({ ...e, thumbnail: message }));
      toast.error(message);
    } finally {
      setThumbUploading(false);
    }
  };

  const clearThumbnail = () => {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(null);
    setThumbnailTempPath(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
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
    setTrailerUploading(true);
    try {
      const path = await uploadTempFile(file, 'video');
      setTrailerTempPath(path);
      setErrors((e) => ({ ...e, trailer: '' }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'خطا در آپلود ویدیو';
      setErrors((e) => ({ ...e, trailer: message }));
      toast.error(message);
    } finally {
      setTrailerUploading(false);
    }
  };

  const thumbnailPending = thumbUploading || (!!thumbnailPreview && !thumbnailTempPath && !errors.thumbnail);

  const handleSave = async () => {
    if (!validate()) return;
    if (thumbnailPending) {
      setErrors((e) => ({ ...e, thumbnail: 'صبر کنید تا آپلود تصویر تمام شود، بعد ذخیره کنید.' }));
      return;
    }
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
          rating:
            formData.rating === undefined || formData.rating === null || Number.isNaN(formData.rating)
              ? null
              : Math.min(5, Math.max(0, formData.rating)),
          likes: formData.likes ?? 0,
          dislikes: formData.dislikes ?? 0,
          ...(thumbnailTempPath ? { thumbnailTempPath } : {}),
          ...(trailerTempPath ? { trailerTempPath } : {}),
        },
      });
      onUpdate(updated);
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(null);
      setThumbnailTempPath(null);
      setTrailerTempPath(null);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
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
    <div className="bg-card rounded-lg shadow p-6 mt-6 text-right">
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
          {errors.subject && <p className="text-destructive text-sm">{errors.subject}</p>}
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
            <label className="block text-sm font-medium mb-2">امتیاز (۰ تا ۵)</label>
            <input
              type="number"
              name="rating"
              min={0}
              max={5}
              step={0.1}
              value={formData.rating ?? ''}
              onChange={handleChange}
              aria-label="امتیاز دوره"
              placeholder="مثلاً ۴.۵"
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.rating && <p className="text-destructive text-sm">{errors.rating}</p>}
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
          <label className="block text-sm font-medium mb-2">تصویر شاخص (JPEG/PNG/WebP, max 5MB)</label>
          {thumbnailPreview ? (
            <div className="relative mb-2 overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbnailPreview} alt="پیش‌نمایش تصویر جدید" className="h-40 w-full object-cover" />
              {thumbUploading && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 text-sm font-medium text-white">
                  در حال آپلود تصویر...
                </div>
              )}
              <button
                type="button"
                onClick={clearThumbnail}
                disabled={thumbUploading || updateMutation.isPending}
                className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-black/80 disabled:opacity-50"
              >
                حذف تصویر
              </button>
            </div>
          ) : (
            course.img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.img} alt="تصویر فعلی دوره" className="mb-2 h-24 w-full rounded-lg object-cover" />
            )
          )}
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="آپلود تصویر شاخص"
            disabled={thumbUploading || updateMutation.isPending}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleThumbnail(f);
            }}
          />
          {thumbUploading && <p className="text-sm text-muted-foreground">در حال آپلود تصویر...</p>}
          {thumbnailTempPath && !thumbUploading && <p className="text-sm text-success">فایل آماده ذخیره — دکمه ذخیره را بزنید</p>}
          {errors.thumbnail && <p className="text-destructive text-sm">{errors.thumbnail}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">ویدیو معرفی (MP4, max 500MB)</label>
          <input
            type="file"
            accept="video/mp4"
            aria-label="آپلود ویدیو معرفی"
            disabled={trailerUploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleTrailer(f);
            }}
          />
          {trailerUploading && <p className="text-sm text-muted-foreground">در حال آپلود ویدیو...</p>}
          {trailerTempPath && !trailerUploading && <p className="text-sm text-success">فایل آماده ذخیره — دکمه ذخیره را بزنید</p>}
          {errors.trailer && <p className="text-destructive text-sm">{errors.trailer}</p>}
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

        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending || thumbUploading || thumbnailPending || trailerUploading}
          aria-label="ذخیره دوره"
        >
          {updateMutation.isPending ? 'در حال ذخیره...' : thumbUploading || thumbnailPending || trailerUploading ? 'صبر کنید، آپلود در جریان است...' : 'ذخیره'}
        </Button>
      </div>
    </div>
  );
}
