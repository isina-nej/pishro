'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, BookOpen, Layers, PlayCircle } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import CourseBasicTab, {
  type CourseBasicTabData,
} from '@/components/admin/course-edit/CourseBasicTab';
import CourseChaptersTab from '@/components/admin/course-edit/CourseChaptersTab';
import CourseLessonsTab from '@/components/admin/course-edit/CourseLessonsTab';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useAdminCourse } from '@/lib/hooks/useAdminCourses';

export const dynamic = 'force-dynamic';

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const { user, isLoading: isAuthLoading, logout } = useAdminAuth();
  const { data, isLoading, error } = useAdminCourse(courseId, Boolean(user && courseId));
  const [course, setCourse] = useState<CourseBasicTabData | null>(null);

  useEffect(() => {
    if (data) {
      setCourse(data as CourseBasicTabData);
    }
  }, [data]);

  if (isAuthLoading || isLoading) {
    return <AdminLoadingState label="در حال دریافت اطلاعات دوره..." />;
  }

  if (!user) {
    return null;
  }

  if (error || !course) {
    return (
      <AdminSidebar user={user} currentPage="courses" onLogout={logout}>
        <AdminPageShell
          title="دوره یافت نشد"
          description="دوره مورد نظر وجود ندارد یا دسترسی به آن ممکن نیست."
          actions={
            <Button asChild variant="outline">
              <Link href="/admin/courses">
                بازگشت به دوره‌ها
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        >
          <Card className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            اطلاعات دوره قابل دریافت نیست.
          </Card>
        </AdminPageShell>
      </AdminSidebar>
    );
  }

  const content = (
    <AdminPageShell
      title={`ویرایش دوره: ${course.subject}`}
      description="اطلاعات پایه، فصل‌ها و درس‌های دوره را از اینجا مدیریت کنید."
      actions={
        <div className="flex flex-wrap gap-2">
          <Badge variant={course.published ? 'default' : 'outline'}>
            {course.published ? 'منتشر شده' : 'مخفی'}
          </Badge>
          <Button asChild variant="outline">
            <Link href="/admin/courses">
              بازگشت
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3">
          <TabsTrigger value="basic" className="justify-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <BookOpen className="h-4 w-4" />
            اطلاعات پایه
          </TabsTrigger>
          <TabsTrigger value="chapters" className="justify-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Layers className="h-4 w-4" />
            فصل‌ها
          </TabsTrigger>
          <TabsTrigger value="lessons" className="justify-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <PlayCircle className="h-4 w-4" />
            درس‌ها
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <CourseBasicTab course={course} onUpdate={setCourse} />
        </TabsContent>
        <TabsContent value="chapters">
          <CourseChaptersTab courseId={course.id} />
        </TabsContent>
        <TabsContent value="lessons">
          <CourseLessonsTab courseId={course.id} hasChapters={course.hasChapters} />
        </TabsContent>
      </Tabs>
    </AdminPageShell>
  );

  return (
    <AdminSidebar user={user} currentPage="courses" onLogout={logout}>
      {content}
    </AdminSidebar>
  );
}
