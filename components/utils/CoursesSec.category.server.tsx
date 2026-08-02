// Server Component برای دریافت دوره‌های یک دسته‌بندی خاص
import CoursesGridCategoryClient from "./CoursesGrid.category.client";
import { getCategoryCourses } from "@/lib/services/category-service";
import { Prisma, type Tag } from "@prisma/client";

interface CoursesSectionProps {
  categorySlug: string;
  categoryTitle: string;
}

// Mirrors the include used by getCategoryCourses. Note the relation is `tags`
// (a CourseTags join model) - the mapping below flattens it into `relatedTags`.
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
    tags: {
      include: {
        tag: true;
      };
    };
    _count: {
      select: {
        enrollments: true;
        comments: true;
      };
    };
  };
}>;

type SerializedTag = Omit<Tag, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

// Type for serialized course with string dates (server -> client)
type SerializedCourse = Omit<CourseWithRelations, "createdAt" | "updatedAt" | "tags"> & {
  createdAt: string;
  updatedAt: string;
  relatedTags: SerializedTag[];
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
    createdAt: (course.createdAt || new Date()).toISOString(),
    updatedAt: (course.updatedAt || new Date()).toISOString(),
    relatedTags: (course.tags || []).map((tagRelation) => ({
      ...tagRelation.tag,
      createdAt: (tagRelation.tag?.createdAt || new Date()).toISOString(),
      updatedAt: (tagRelation.tag?.updatedAt || new Date()).toISOString(),
    })),
  })) as SerializedCourse[];

  return (
    <CoursesGridCategoryClient
      courses={serializedCourses}
      categorySlug={categorySlug}
      categoryTitle={categoryTitle}
    />
  );
}
