// @/app/admin/courses/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseBasicTab from '@/components/admin/course-edit/CourseBasicTab';
import CourseChaptersTab from '@/components/admin/course-edit/CourseChaptersTab';
import CourseLessonsTab from '@/components/admin/course-edit/CourseLessonsTab';
import AdminSidebar from '@/components/admin/AdminSidebar';
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

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'VIEWER';
}

export default function CourseEditPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('admin_access_token');
        
        if (!token) {
          router.push('/admin/login');
          return;
        }

        // Fetch current user
        const userResponse = await fetch('/api/admin/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          localStorage.removeItem('admin_access_token');
          router.push('/admin/login');
          return;
        }

        const userData = await userResponse.json();
        setUser(userData.user);

        // Fetch course data
        const courseResponse = await api.get(`/api/admin/courses/${courseId}`);
        setCourse(courseResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('خطا در دریافت اطلاعات');
        router.push('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">دوره یافت نشد</p>
      </div>
    );
  }

  const content = (
    <div className="w-full">
      <div className="mb-6 text-right">
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
          <TabsTrigger value="chapters">فصل‌ها</TabsTrigger>
          <TabsTrigger value="lessons">درس‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <CourseBasicTab course={course} onUpdate={setCourse} />
        </TabsContent>

        <TabsContent value="chapters">
          {course.hasChapters ? (
            <CourseChaptersTab courseId={courseId} />
          ) : (
            <p className="mt-6 text-gray-500 p-6 bg-white dark:bg-cardBg rounded-lg shadow">
              برای استفاده از فصل‌ها، گزینه «استفاده از فصل‌ها» را در تب اطلاعات پایه فعال کنید.
            </p>
          )}
        </TabsContent>

        <TabsContent value="lessons">
          <CourseLessonsTab courseId={courseId} hasChapters={course.hasChapters} />
        </TabsContent>
      </Tabs>
    </div>
  );

  return <AdminSidebar user={user} currentPage="courses">{content}</AdminSidebar>;
}
