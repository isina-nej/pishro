// Server Component برای دریافت دوره‌های یک دسته‌بندی خاص
import CoursesGridCategoryClient from "./CoursesGrid.category.client";
import { getCategoryCourses } from "@/lib/services/category-service";
import { Prisma } from "@prisma/client";

interface CoursesSectionProps {
  categorySlug: string;
  categoryTitle: string;
}

// Type for serialized course with string dates (server -> client)
type CourseWithRelations = Prisma.CourseGetPayload<{
  include: {
    category: {
      select: {
        id: true;
        slug: true;
        title: true;
        color: true;
      };
    };
    relatedTags: true;
    _count: {
      select: {
        enrollments: true;
        comments: true;
      };
    };
  };
}>;

type SerializedCourse = Omit<CourseWithRelations, "createdAt" | "updatedAt" | "relatedTags"> & {
  createdAt: string;
  updatedAt: string;
  relatedTags: Array<Omit<CourseWithRelations["relatedTags"][number], "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  }>;
};

export default async function CoursesSectionCategory({
  categorySlug,
  categoryTitle,
}: CoursesSectionProps) {
  // دریافت همه دوره‌های منتشر شده (بدون محدودیت)
  const coursesData = await getCategoryCourses(categorySlug, {
    page: 1,
    limit: 100, // تعداد زیاد برای گرفتن همه دوره‌ها
  });

  // Serialize dates to strings for client component
  const serializedCourses: SerializedCourse[] = coursesData.courses.map((course) => ({
    ...course,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    relatedTags: course.relatedTags.map((tag) => ({
      ...tag,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    })),
  }));

  return (
    <CoursesGridCategoryClient
      courses={serializedCourses}
      categorySlug={categorySlug}
      categoryTitle={categoryTitle}
    />
  );
}
