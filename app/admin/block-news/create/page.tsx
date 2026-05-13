/**
 * Create News Page
 * 
 * Page: /admin/block-news/create
 * Create a new block-based news article
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight } from 'lucide-react';
import { useCreateBlockNews, useBlockNews } from '@/lib/hooks/use-block-news';
import BlockEditor from '@/components/BlockNews/BlockEditor';

export const dynamic = 'force-dynamic';

export default function CreateBlockNewsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createNewsMutation = useCreateBlockNews();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('عنوان خبر الزامی است');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createNewsMutation.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        categoryId: formData.categoryId || undefined,
      });

      // Redirect to edit page
      router.push(`/admin/block-news/${result.id}/edit`);
    } catch (error) {
      console.error('خطا در ایجاد خبر:', error);
      alert('خطایی رخ داده است');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">خبر جدید</h1>
      </div>

      {/* Form */}
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">عنوان خبر *</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="عنوان خبر را وارد کنید..."
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">توضیح کوتاه</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="توضیح کوتاهی برای نمایش در لیست..."
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">دسته‌بندی</label>
          <Input
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            placeholder="شناسه دسته‌بندی"
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">اختیاری - می‌توانید بعدا تغییر دهید</p>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            انصراف
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title.trim()}
          >
            {isSubmitting ? 'درحال ایجاد...' : 'ایجاد خبر'}
          </Button>
        </div>
      </Card>

      {/* Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          💡 پس از ایجاد خبر، می‌توانید محتوا و بلاک‌ها را اضافه کنید
        </p>
      </Card>
    </div>
  );
}
