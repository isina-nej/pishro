// @/components/admin/course-edit/CourseBasicTab.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface Course {
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
  img?: string;
}

interface CourseBasicTabProps {
  course: Course;
  onUpdate: (course: Course) => void;
}

export default function CourseBasicTab({ course, onUpdate }: CourseBasicTabProps) {
  const [formData, setFormData] = useState(course);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data } = await axios.patch(`/api/admin/courses/${course.id}`, formData);
      onUpdate(data.data);
      toast.success('اطلاعات دوره با موفقیت ذخیره شد');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'خطا در ذخیره تغییرات');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-cardBg rounded-lg shadow p-6 mt-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">نام دوره</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">قیمت</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">مدرس</label>
          <input
            type="text"
            name="instructor"
            value={formData.instructor || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">توضیحات</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="hasChapters"
              checked={formData.hasChapters}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm">استفاده از فصل‌ها</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm">منتشر شده</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm">پیشنهادی</span>
          </label>
        </div>

        <div className="pt-4 flex gap-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
          </Button>
        </div>
      </div>
    </div>
  );
}
