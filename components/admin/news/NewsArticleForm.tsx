'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EmojiTextInput from '@/components/admin/EmojiTextInput';
import EmojiTextarea from '@/components/admin/EmojiTextarea';
import {
  ArrowRight,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Tag,
  Zap,
  Upload,
  X,
  Clock,
} from 'lucide-react';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import CKEditor5Wrapper from '@/components/admin/news/CKEditor5Wrapper';
import { api } from '@/lib/api-client';

export interface NewsFormData {
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  categoryId: string;
  author: string;
  publishOption: string;
  scheduledDate: string;
  scheduledTime: string;
}

export const emptyNewsForm = (): NewsFormData => ({
  title: '',
  description: '',
  content: '',
  thumbnail: '',
  categoryId: '',
  author: '',
  publishOption: 'manual',
  scheduledDate: '',
  scheduledTime: '',
});

interface NewsArticleFormProps {
  formData: NewsFormData;
  onChange: (patch: Partial<NewsFormData>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isSubmitting: boolean;
  isUploadingImage: boolean;
  uploadError: string;
  error: string;
  isEdit?: boolean;
  onSubmit: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export default function NewsArticleForm({
  formData,
  onChange,
  onInputChange,
  isSubmitting,
  isUploadingImage,
  uploadError,
  error,
  isEdit = false,
  onSubmit,
  onImageUpload,
  onRemoveImage,
}: NewsArticleFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <AdminPageShell
      title={isEdit ? 'ویرایش خبر' : 'خبر جدید'}
      description={isEdit ? 'ویرایش خبر موجود' : 'ایجاد خبر جدید در سایت'}
      actions={
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowRight className="size-4" />
          بازگشت
        </Button>
      }
    >
      {error && (
        <Card className="flex items-start gap-3 border-destructive/30 bg-destructive/10 p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <div className="space-y-4 md:space-y-6 lg:col-span-2">
          <Card className="space-y-4 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <FileText className="size-5 shrink-0 text-primary" />
              <h2 className="text-lg font-bold md:text-xl">اطلاعات پایه‌ای</h2>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <span className="text-destructive">*</span>
                عنوان خبر
              </Label>
              <EmojiTextInput
                name="title"
                value={formData.title}
                onChange={onInputChange}
                placeholder="عنوان جذاب و توصیفی برای خبر..."
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">این عنوان در لیست اخبار و صفحه اصلی نمایش داده می‌شود</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">توضیح کوتاه (خلاصه)</Label>
              <EmojiTextarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                placeholder="یک خلاصه کوتاه برای جذب توجه خواننده..."
                rows={3}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">حداکثر 200 کاراکتر برای بهترین نمایش</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">محتوای کامل خبر</Label>
              <CKEditor5Wrapper
                initialContent={formData.content}
                placeholder="محتوای خبر را بنویسید..."
                onContentChange={(html) => onChange({ content: html })}
                disabled={isSubmitting}
                rtl={true}
                maxHeight="600px"
              />
              <p className="text-xs text-muted-foreground">از ابزارهای CKEditor 5 برای فرمت‌بندی متن استفاده کنید</p>
            </div>
          </Card>

          <Card className="space-y-4 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <ImageIcon className="size-5 shrink-0 text-primary" />
              <h2 className="text-lg font-bold md:text-xl">تصویر شاخص (کاور)</h2>
            </div>

            {!formData.thumbnail ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  variant="outline"
                  className="flex h-32 w-full flex-col items-center justify-center gap-3 border-2 border-dashed md:h-40"
                >
                  <Upload className="size-6 text-primary md:size-8" />
                  <div className="px-2 text-center">
                    <p className="text-sm font-semibold text-primary md:text-base">
                      {isUploadingImage ? 'درحال آپلود...' : 'انتخاب تصویر'}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">یا اینجا رها کنید</p>
                  </div>
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  فرمت‌های پشتیبانی‌شده: JPG, PNG, WebP (حداکثر 5MB)
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative h-40 w-full overflow-hidden rounded-lg shadow-md ring-2 ring-primary/20 md:h-48">
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin-supplied thumbnail URL, host is not in next.config remotePatterns */}
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={onRemoveImage}
                    disabled={isUploadingImage}
                    className="absolute right-2 top-2 rounded-lg bg-destructive p-2 text-destructive-foreground shadow-lg transition-all hover:bg-destructive/90"
                    aria-label="حذف تصویر"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  variant="outline"
                  className="h-10 w-full text-sm md:h-11 md:text-base"
                >
                  <Upload className="ml-2 size-4" />
                  تغییر تصویر
                </Button>
              </div>
            )}

            {uploadError && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                <p className="text-xs text-destructive md:text-sm">{uploadError}</p>
              </div>
            )}
          </Card>

          <Card className="space-y-4 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <Tag className="size-5 shrink-0 text-primary" />
              <h2 className="text-lg font-bold md:text-xl">دسته‌بندی</h2>
            </div>

            <Input
              name="categoryId"
              value={formData.categoryId}
              onChange={onInputChange}
              placeholder="شناسه دسته‌بندی (اختیاری)"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">می‌توانید بعدا تغییر دهید</p>
          </Card>

          <Card className="space-y-4 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <FileText className="size-5 shrink-0 text-primary" />
              <h2 className="text-lg font-bold md:text-xl">نویسنده</h2>
            </div>

            <Input
              name="author"
              value={formData.author}
              onChange={onInputChange}
              placeholder="نام نویسنده (اختیاری)"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">نام نویسنده خبر</p>
          </Card>

          <Card className="space-y-4 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <Clock className="size-5 shrink-0 text-primary" />
              <h2 className="text-lg font-bold md:text-xl">انتشار تایم دار</h2>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-muted p-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="publishOption"
                  value="manual"
                  checked={formData.publishOption === 'manual'}
                  onChange={onInputChange}
                  className="size-4 accent-primary"
                />
                <span className="text-sm font-medium">فوری</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="publishOption"
                  value="scheduled"
                  checked={formData.publishOption === 'scheduled'}
                  onChange={onInputChange}
                  className="size-4 accent-primary"
                />
                <span className="text-sm font-medium">تایم دار</span>
              </label>
            </div>

            {formData.publishOption === 'scheduled' && (
              <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div>
                  <Label className="mb-2 block text-sm font-semibold">تاریخ انتشار</Label>
                  <Input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={onInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-semibold">ساعت انتشار</Label>
                  <Input
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={onInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-xs text-primary">خبر در تاریخ و ساعت مشخص شده به صورت خودکار منتشر خواهد شد</p>
              </div>
            )}

            {formData.publishOption === 'manual' && (
              <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                خبر فوری منتشر خواهد شد
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-4 md:space-y-6">
          <Card className="border-primary/20 bg-primary/5 p-4 md:p-6">
            <div className="space-y-2 md:space-y-3">
              <Button
                onClick={onSubmit}
                disabled={isSubmitting || !formData.title.trim()}
                className="h-10 w-full gap-2 text-sm font-semibold md:h-12 md:text-base"
              >
                <Zap className="ml-2 size-4 md:size-5" />
                {isSubmitting ? 'درحال ذخیره...' : isEdit ? 'ذخیره تغییرات' : 'انتشار خبر'}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isSubmitting}
                className="h-10 w-full text-sm md:h-11 md:text-base"
              >
                انصراف
              </Button>
            </div>
          </Card>

          <Card className="border-primary/20 bg-primary/5 p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3">
                <Zap className="mt-1 size-4 shrink-0 text-primary md:size-5" />
                <div>
                  <h3 className="mb-2 text-xs font-bold md:text-sm">نکات مهم:</h3>
                  <ul className="space-y-1 text-xs text-foreground/80 md:space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">•</span>
                      <span>عنوان <span className="font-semibold">الزامی</span> است</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">•</span>
                      <span>تغییرات به فوری ذخیره می‌شوند</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminPageShell>
  );
}

export async function uploadNewsThumbnail(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('فقط فایل‌های تصویری قابل آپلود هستند');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('حجم فایل نباید بیشتر از 5 مگابایت باشد');
  }

  const formDataForUpload = new FormData();
  formDataForUpload.append('file', file);
  formDataForUpload.append('kind', 'thumbnail');

  // api client attaches the admin Bearer token from localStorage automatically
  const { data } = await api.post('/api/admin/uploads/temp', formDataForUpload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  let imageUrl = data.data.tempPath as string;
  if (!imageUrl.startsWith('/')) {
    imageUrl = '/' + imageUrl;
  }
  if (!imageUrl.startsWith('/api/uploads/')) {
    imageUrl = '/api/uploads' + imageUrl;
  }
  return imageUrl;
}
