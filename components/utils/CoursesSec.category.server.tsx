// Server Component برای دریافت دوره‌های یک دسته‌بندی خاص
import CoursesGridCategoryClient from "./CoursesGrid.category.client";
import { getCategoryCourses } from "@/lib/services/category-service";
import { Course } from "@prisma/client";

interface CoursesSectionProps {
  categorySlug: string;
  categoryTitle: string;
}

export default async function CoursesSectionCategory({
  categorySlug,
  categoryTitle,
}: CoursesSectionProps) {
  // دریافت همه دوره‌های منتشر شده (بدون محدودیت)
  const coursesData = await getCategoryCourses(categorySlug, {
    page: 1,
    limit: 12, // تعداد زیاد برای گرفتن همه دوره‌ها
  });

  const courses: Course[] = coursesData.courses as Course[];

  return (
    <CoursesGridCategoryClient
      courses={courses}
      categorySlug={categorySlug}
      categoryTitle={categoryTitle}
    />
  );
}
