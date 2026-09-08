'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  BOOK_FORMATS,
  BOOK_STATUSES,
  BookBasicInfo,
  BookChecklist,
  BookDescription,
  BookMediaUpload,
  emptyBookForm,
  generateSlug,
} from '@/components/admin/books/BookFormFields';

export const dynamic = 'force-dynamic';

export default function CreateBookPage() {
  const router = useRouter();
  const { user, isLoading: isLoadingUser } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState(emptyBookForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else if (name === 'title') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormatChange = (format: string) => {
    setFormData((prev) => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter((f) => f !== format)
        : [...prev.formats, format],
    }));
  };

  const handleStatusChange = (status: string) => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'cover' | 'pdf' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadingFile(fileType);
      setError(null);

      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('fileType', fileType);

      const response = await fetch('/api/library/upload', {
        method: 'POST',
        credentials: 'include',
        body: uploadForm,
      });

      const data = await response.json();

      if (data.success) {
        const fieldMap = { cover: 'cover', pdf: 'fileUrl', audio: 'audioUrl' };
        setFormData((prev) => ({
          ...prev,
          [fieldMap[fileType]]: data.url,
        }));
      } else {
        setError(data.message || 'خطا در بارگذاری فایل');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داد');
    } finally {
      setIsUploading(false);
      setUploadingFile(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.author || !formData.category) {
      setError('لطفاً فیلدهای الزامی را پر کنید');
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        ...formData,
        year: parseInt(formData.year),
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const response = await fetch('/api/library', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/library');
      } else {
        setError(data.message || 'خطا در ایجاد کتاب');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داد');
      console.error('Error creating book:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingUser) {
    return (
      <AdminPageShell title="کتاب جدید" description="افزودن کتاب به کتابخانه دیجیتال">
        <AdminLoadingState />
      </AdminPageShell>
    );
  }

  if (!user) return null;

  return (
    <AdminPageShell
      title="ایجاد کتاب جدید"
      description="یک کتاب جدید به کتابخانه دیجیتالی اضافه کنید"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/library">
            <ArrowRight className="size-4" />
            بازگشت به کتابخانه
          </Link>
        </Button>
      }
    >
      {error && (
        <Card className="border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </Card>
      )}

      <Card className="border-primary/20 bg-primary/5 p-4 text-sm leading-6">
        <p className="font-semibold text-foreground">📝 توجه:</p>
        <p className="text-muted-foreground">
          کتاب‌ها به طور پیش‌فرض با وضعیت <strong className="text-foreground">پیشنویس</strong> ایجاد می‌شوند.
          بعد از تکمیل اطلاعات، می‌توانید کتاب را منتشر کنید.
        </p>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-8 p-6">
          <BookBasicInfo formData={formData} disabled={isLoading} onChange={handleChange} />

          <BookDescription value={formData.description} disabled={isLoading} onChange={handleChange} />

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">رسانه</h2>
            <div className="grid gap-4">
              <BookMediaUpload
                label="جلد کتاب"
                accept="image/jpeg,image/png,image/webp"
                hint="تصویر جلد را انتخاب کنید (حداکثر 5MB)"
                currentUrl={formData.cover}
                uploading={uploadingFile === 'cover'}
                disabled={isUploading}
                onPick={(e) => handleFileUpload(e, 'cover')}
                onClear={() => setFormData((prev) => ({ ...prev, cover: '' }))}
              />
              <BookMediaUpload
                label="فایل PDF"
                accept="application/pdf"
                hint="فایل PDF کتاب (حداکثر 100MB)"
                currentUrl={formData.fileUrl}
                uploading={uploadingFile === 'pdf'}
                disabled={isUploading}
                onPick={(e) => handleFileUpload(e, 'pdf')}
                onClear={() => setFormData((prev) => ({ ...prev, fileUrl: '' }))}
              />
              <BookMediaUpload
                label="فایل صوتی"
                accept="audio/*"
                hint="فایل صوتی کتاب (حداکثر 200MB)"
                currentUrl={formData.audioUrl}
                uploading={uploadingFile === 'audio'}
                disabled={isUploading}
                onPick={(e) => handleFileUpload(e, 'audio')}
                onClear={() => setFormData((prev) => ({ ...prev, audioUrl: '' }))}
              />
            </div>
          </section>

          <BookChecklist
            title="فرمت‌های موجود"
            options={BOOK_FORMATS}
            selected={formData.formats}
            onToggle={handleFormatChange}
          />

          <BookChecklist
            title="وضعیت"
            options={BOOK_STATUSES}
            selected={formData.status}
            onToggle={handleStatusChange}
          />

          <section>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">برچسب‌ها (جدا شده با کاما)</label>
                <Input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="تکنولوژی، بورس، سرمایه‌گذاری"
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="size-4 cursor-pointer rounded border-input accent-primary"
                  />
                  <span className="font-medium text-foreground">منتخب (Highlighted)</span>
                </label>
              </div>
            </div>
          </section>

          <div className="flex gap-3 border-t border-border pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1 gap-2">
              {isLoading && <Loader2 className="size-5 animate-spin" />}
              {isLoading ? 'در حال ذخیره...' : 'ایجاد کتاب'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/library">انصراف</Link>
            </Button>
          </div>
        </Card>
      </form>
    </AdminPageShell>
  );
}
