'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, BookOpen, Layers, PlayCircle } from 'lucide-react';
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
  const { user, isLoading: isAuthLoading } = useAdminAuth();
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
        <Card className="p-6 text-center text-sm text-muted-foreground">
          اطلاعات دوره قابل دریافت نیست.
        </Card>
      </AdminPageShell>
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
        <TabsList className="grid gap-2 rounded-2xl border border-border bg-card p-2 sm:grid-cols-3">
          <TabsTrigger value="basic" className="justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="h-4 w-4" />
            اطلاعات پایه
          </TabsTrigger>
          <TabsTrigger value="chapters" className="justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Layers className="h-4 w-4" />
            فصل‌ها
          </TabsTrigger>
          <TabsTrigger value="lessons" className="justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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

  return content;
}
