'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  BOOK_CATEGORIES,
  BOOK_FORMATS,
  BOOK_STATUSES,
  BookBasicInfo,
  BookChecklist,
  BookDescription,
  BookMediaUpload,
  emptyBookForm,
} from '@/components/admin/books/BookFormFields';

export const dynamic = 'force-dynamic';

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState(emptyBookForm);
  const { user, isLoading: isLoadingUser } = useAdminAuth();

  // Load book data
  useEffect(() => {
    const loadBook = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/library/${bookId}`);

        if (!response.ok) {
          setError('کتاب یافت نشد');
          return;
        }

        const data = await response.json();
        const book = data.data || data;

        setFormData({
          title: book.title || '',
          slug: book.slug || '',
          author: book.author || '',
          description: book.description || '',
          cover: book.cover || '',
          publisher: book.publisher || '',
          year: book.year?.toString() || new Date().getFullYear().toString(),
          pages: book.pages?.toString() || '',
          isbn: book.isbn || '',
          language: book.language || 'فارسی',
          category: book.category || BOOK_CATEGORIES[0],
          formats: Array.isArray(book.formats) ? book.formats : [],
          status: Array.isArray(book.status) ? book.status : [],
          tags: Array.isArray(book.tags) ? book.tags.join(', ') : '',
          readingTime: book.readingTime || '',
          isFeatured: book.isFeatured || false,
          price: book.price?.toString() || '',
          fileUrl: book.fileUrl || '',
          audioUrl: book.audioUrl || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در دریافت کتاب');
        console.error('Error loading book:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (bookId) {
      loadBook();
    }
  }, [bookId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
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

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('fileType', fileType);

      const response = await fetch('/api/library/upload', {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        // Update form data with uploaded file URL
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
      // Clear input
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title || !formData.author || !formData.category) {
      setError('لطفاً فیلدهای الزامی را پر کنید');
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        ...formData,
        year: parseInt(formData.year),
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const response = await fetch(`/api/library/${bookId}`, {
        method: 'PUT',
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
        setError(data.message || 'خطا در ویرایش کتاب');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داد');
      console.error('Error updating book:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isLoadingUser) {
    return (
      <AdminPageShell title="ویرایش کتاب" description="در حال بارگذاری اطلاعات کتاب...">
        <AdminLoadingState />
      </AdminPageShell>
    );
  }

  if (!user) return null;

  return (
    <AdminPageShell
      title="ویرایش کتاب"
      description="اطلاعات کتاب را ویرایش کنید"
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

      <form onSubmit={handleSubmit}>
        <Card className="space-y-8 p-6">
          <BookBasicInfo formData={formData} disabled={isSaving} onChange={handleChange} />

          <BookDescription value={formData.description} disabled={isSaving} onChange={handleChange} />

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
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="size-4 cursor-pointer rounded border-input accent-primary"
                  />
                  <span className="font-medium text-foreground">منتخب (Highlighted)</span>
                </label>
              </div>
            </div>
          </section>

          <div className="flex gap-3 border-t border-border pt-4">
            <Button type="submit" disabled={isSaving} className="flex-1 gap-2">
              {isSaving && <Loader2 className="size-5 animate-spin" />}
              {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
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
