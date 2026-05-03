import { getLessonById, getLessonsByCourse } from "@/lib/services/lesson-service";
import ClassPageContent from "@/components/class/pageContent";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

interface ClassPageProps {
  params: Promise<{
    classId: string;
  }>;
}

export default async function ClassPage({ params }: ClassPageProps) {
  const { classId } = await params;

  // بررسی احراز هویت
  const session = await auth();
  if (!session?.user) {
    // اگر کاربر لاگین نکرده، به صفحه لاگین هدایت می‌شود
    // این کار توسط middleware انجام می‌شود
    return null;
  }

  // دریافت اطلاعات کلاس
  const lessonData = await getLessonById(classId);

  // اگر کلاس یافت نشد، صفحه not-found نمایش داده می‌شود
  if (!lessonData) {
    notFound();
  }

  // بررسی اینکه کلاس منتشر شده باشد
  if (!lessonData.published) {
    notFound();
  }

  // دریافت تمام کلاس‌های دوره مربوطه
  const courseLessons = await getLessonsByCourse(lessonData.courseId);

  return <ClassPageContent lessonData={lessonData} courseLessons={courseLessons} />;
}
