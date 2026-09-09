'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
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
import { renderWithAnimatedEmoji } from '@/lib/admin/animated-emoji-render';
import EmojiTextInput from '@/components/admin/EmojiTextInput';
import EmojiTextarea from '@/components/admin/EmojiTextarea';

export interface CourseBasicTabData {
  id: string;
  subject: string;
  slug?: string | null;
  price: number;
  description?: string;
  categoryId?: string;
  category?: { id: string; slug: string; title: string } | null;
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
  const [categories, setCategories] = useState<Array<{ id: string; title: string }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setCategoriesLoading(true);
        const { data } = await api.get('/api/admin/categories?limit=100');
        if (!cancelled) setCategories(data.data?.items ?? []);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setFormData(course);
  }, [course.id]);

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
          slug: formData.slug || null,
          cost: formData.price,
          description: formData.description,
          categoryId: formData.categoryId || null,
          instructor: formData.instructor,
          level: formData.level || null,
          status: formData.status,
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
          <EmojiTextInput
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            maxLength={200}
            aria-label="نام دوره"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {formData.subject.includes(':animated-emoji:') && (
            <p className="mt-1 text-sm">پیش‌نمایش: {renderWithAnimatedEmoji(formData.subject)}</p>
          )}
          {errors.subject && <p className="text-destructive text-sm">{errors.subject}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">آدرس دوره (اسلاگ)</label>
          <input
            type="text"
            name="slug"
            value={formData.slug ?? ''}
            onChange={handleChange}
            dir="ltr"
            aria-label="آدرس دوره"
            placeholder="technical-analysis"
            className="w-full px-4 py-2 border rounded-lg text-left"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium">دسته‌بندی</label>
              <Link href="/admin/categories" className="text-xs font-medium text-primary hover:underline">
                مدیریت دسته‌بندی‌ها
              </Link>
            </div>
            <select
              name="categoryId"
              value={formData.categoryId ?? ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value || undefined }))}
              aria-label="دسته‌بندی دوره"
              disabled={categoriesLoading}
              className="w-full rounded-lg border bg-background px-4 py-2"
            >
              <option value="">بدون دسته‌بندی</option>
              {formData.categoryId &&
                formData.category &&
                !categories.some((c) => c.id === formData.categoryId) && (
                  <option value={formData.categoryId}>{formData.category.title}</option>
                )}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">مدرس</label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor ?? ''}
              onChange={handleChange}
              maxLength={120}
              aria-label="مدرس دوره"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">سطح دوره</label>
            <select
              name="level"
              value={formData.level ?? ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value || undefined }))}
              aria-label="سطح دوره"
              className="w-full rounded-lg border bg-background px-4 py-2"
            >
              <option value="">تعیین نشده</option>
              <option value="BEGINNER">مقدماتی</option>
              <option value="INTERMEDIATE">متوسط</option>
              <option value="ADVANCED">پیشرفته</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">وضعیت دوره</label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              aria-label="وضعیت دوره"
              className="w-full rounded-lg border bg-background px-4 py-2"
            >
              <option value="ACTIVE">فعال</option>
              <option value="COMING_SOON">به‌زودی</option>
              <option value="ARCHIVED">آرشیو</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { key: 'published', label: 'نمایش در سایت', hint: 'قابل مشاهده برای کاربران' },
            { key: 'featured', label: 'دوره ویژه', hint: 'بخش‌های منتخب صفحه اصلی' },
            { key: 'hasChapters', label: 'فصل‌بندی', hint: 'درس‌ها داخل فصل‌ها' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border p-3"
            >
              <input
                type="checkbox"
                name={item.key}
                checked={Boolean(formData[item.key as keyof typeof formData])}
                onChange={handleChange}
                aria-label={item.label}
                className="mt-1"
              />
              <span className="text-right">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.hint}</span>
              </span>
            </label>
          ))}
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
          <EmojiTextarea
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
