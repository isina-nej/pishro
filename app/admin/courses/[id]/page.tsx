// @/app/admin/courses/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseBasicTab from '@/components/admin/course-edit/CourseBasicTab';
import CourseChaptersTab from '@/components/admin/course-edit/CourseChaptersTab';
import CourseLessonsTab from '@/components/admin/course-edit/CourseLessonsTab';
import { toast } from 'react-hot-toast';

interface CourseData {
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

export default function CourseEditPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`/api/admin/courses/${courseId}`);
        setCourse(data.data);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        toast.error('خطا در دریافت اطلاعات دوره');
        router.push('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">دوره یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="container-xl mt-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-textPrimary">
          {course.subject}
        </h1>
        <p className="text-gray-600 dark:text-textSecondary mt-2">
          ویرایش دوره
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="basic">اطلاعات پایه</TabsTrigger>
          {course.hasChapters && (
            <TabsTrigger value="chapters">فصل‌ها</TabsTrigger>
          )}
          <TabsTrigger value="lessons">درس‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <CourseBasicTab course={course} onUpdate={setCourse} />
        </TabsContent>

        {course.hasChapters && (
          <TabsContent value="chapters">
            <CourseChaptersTab courseId={courseId} />
          </TabsContent>
        )}

        <TabsContent value="lessons">
          <CourseLessonsTab courseId={courseId} hasChapters={course.hasChapters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
