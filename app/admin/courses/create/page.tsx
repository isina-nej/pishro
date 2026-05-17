'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight } from 'lucide-react';
import { useCreateAdminCourse } from '@/lib/hooks/useAdminCourses';

export const dynamic = 'force-dynamic';

export default function CreateCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    price: 0,
    description: '',
    categoryId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCourseMutation = useCreateAdminCourse();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.subject.trim()) {
      alert('عنوان دوره الزامی است');
      return;
    }

    if (formData.price < 0) {
      alert('قیمت باید عدد نامنفی باشد');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCourseMutation.mutateAsync({
        subject: formData.subject,
        price: formData.price,
        description: formData.description || undefined,
        categoryId: formData.categoryId || undefined,
      });

      // Redirect to edit page
      router.push(`/admin/courses/${result.id}/edit`);
    } catch (error) {
      console.error('خطا در ایجاد دوره:', error);
      // Toast is handled by the mutation hook
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
        <h1 className="text-3xl font-bold">دوره جدید</h1>
      </div>

      {/* Form */}
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">عنوان دوره *</label>
          <Input
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="عنوان دوره را وارد کنید..."
            disabled={isSubmitting}
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">قیمت *</label>
          <Input
            type="number"
            name="price"
            min={0}
            max={2147483647}
            value={formData.price}
            onChange={handleInputChange}
            placeholder="قیمت دوره را وارد کنید..."
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
          <label className="text-sm font-medium">شناسه دسته‌بندی</label>
          <Input
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            placeholder="شناسه دسته‌بندی (اختیاری)"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || createCourseMutation.isPending}
            aria-label="ایجاد دوره"
          >
            {isSubmitting || createCourseMutation.isPending ? 'در حال ایجاد...' : 'ایجاد دوره'}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting || createCourseMutation.isPending}
          >
            انصراف
          </Button>
        </div>
      </Card>
    </div>
  );
}
