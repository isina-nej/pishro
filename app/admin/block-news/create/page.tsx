/**
 * Create News Page
 *
 * Page: /admin/block-news/create
 * Create a new block-based news article
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NewsArticleForm, {
  emptyNewsForm,
  uploadNewsThumbnail,
} from '@/components/admin/news/NewsArticleForm';
import { useCreateBlockNews } from '@/lib/hooks/use-block-news';

export const dynamic = 'force-dynamic';

export default function CreateBlockNewsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(emptyNewsForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [error, setError] = useState<string>('');

  const createNewsMutation = useCreateBlockNews();

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
      const publishedAtTime =
        formData.publishOption === 'scheduled'
          ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString()
          : undefined;

      await createNewsMutation.mutateAsync({
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
      console.error('خطا در ایجاد خبر:', err);
      setError(err instanceof Error ? err.message : 'خطایی رخ داده است');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NewsArticleForm
      formData={formData}
      onChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
      onInputChange={handleInputChange}
      isSubmitting={isSubmitting}
      isUploadingImage={isUploadingImage}
      uploadError={uploadError}
      error={error}
      onSubmit={handleSubmit}
      onImageUpload={handleImageUpload}
      onRemoveImage={handleRemoveImage}
    />
  );
}
