/**
 * Edit News Page
 *
 * Page: /admin/block-news/[id]/edit
 * Edit an existing block-based news article
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import NewsArticleForm, {
  emptyNewsForm,
  uploadNewsThumbnail,
  type NewsFormData,
} from '@/components/admin/news/NewsArticleForm';
import { api } from '@/lib/api-client';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export const dynamic = 'force-dynamic';

/** تاریخ محلی به فرمت مورد نیاز input[type=date] */
function toDateInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** ساعت محلی به فرمت مورد نیاز input[type=time] */
function toTimeInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EditBlockNewsPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const { user, isLoading: isLoadingUser } = useAdminAuth();
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [article, setArticle] = useState<{ publishedAt?: string | null } | null>(null);

  const [formData, setFormData] = useState<NewsFormData>(emptyNewsForm);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Get article data — api client attaches the admin Bearer token automatically
  useEffect(() => {
    const fetchArticle = async () => {
      if (!user || !articleId) return;

      try {
        const { data } = await api.get(`/api/admin/block-news/${articleId}`);
        const newsArticle = data.data || data;

        // اگر تاریخ انتشار در آینده باشد یعنی خبر تایم‌دار است و باید فرم را همان‌طور نشان دهیم
        const publishedAt = newsArticle.publishedAt ? new Date(newsArticle.publishedAt) : null;
        const isScheduled = !!publishedAt && publishedAt.getTime() > Date.now();

        setArticle(newsArticle);
        setFormData({
          title: newsArticle.title || '',
          description: newsArticle.excerpt || '',
          content: newsArticle.content || '',
          thumbnail: newsArticle.coverImage || '',
          categoryId: newsArticle.categoryId || '',
          author: newsArticle.author || '',
          publishOption: isScheduled ? 'scheduled' : 'manual',
          scheduledDate: isScheduled ? toDateInputValue(publishedAt) : '',
          scheduledTime: isScheduled ? toTimeInputValue(publishedAt) : '',
        });
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('خطا در بارگذاری خبر');
      } finally {
        setIsLoadingArticle(false);
      }
    };

    if (user) {
      fetchArticle();
    }
  }, [user, articleId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadError('');

    try {
      const imageUrl = await uploadNewsThumbnail(file);
      setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در آپلود فایل';
      setUploadError(errorMessage);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, thumbnail: '' }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('عنوان خبر الزامی است');
      return;
    }

    if (formData.publishOption === 'scheduled') {
      if (!formData.scheduledDate || !formData.scheduledTime) {
        setError('برای انتشار تایم دار، تاریخ و ساعت را مشخص کنید');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      const wasScheduled =
        !!article?.publishedAt && new Date(article.publishedAt).getTime() > Date.now();

      // تایم‌دار: تاریخ انتخاب‌شده. فوری: اگر قبلاً زمان‌بندی بود همین حالا منتشر شود،
      // وگرنه تاریخ انتشار قبلی دست‌نخورده بماند تا ترتیب اخبار به‌هم نریزد.
      const publishedAtTime =
        formData.publishOption === 'scheduled'
          ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString()
          : wasScheduled
            ? new Date().toISOString()
            : undefined;

      await api.patch(`/api/admin/block-news/${articleId}`, {
        title: formData.title,
        description: formData.description || undefined,
        content: formData.content || undefined,
        thumbnail: formData.thumbnail || undefined,
        categoryId: formData.categoryId || undefined,
        author: formData.author || undefined,
        publishedAt: publishedAtTime,
      });

      router.push('/admin/block-news');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطایی رخ داده است';
      console.error('Update error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser || isLoadingArticle) {
    return (
      <AdminPageShell title="ویرایش خبر" description="ویرایش خبر موجود">
        <AdminLoadingState />
      </AdminPageShell>
    );
  }

  if (!user || !article) return null;

  return (
    <NewsArticleForm
      formData={formData}
      onChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
      onInputChange={handleInputChange}
      isSubmitting={isSubmitting}
      isUploadingImage={isUploadingImage}
      uploadError={uploadError}
      error={error}
      isEdit
      onSubmit={handleSubmit}
      onImageUpload={handleImageUpload}
      onRemoveImage={handleRemoveImage}
    />
  );
}
