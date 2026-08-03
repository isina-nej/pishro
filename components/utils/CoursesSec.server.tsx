// app/components/utils/CoursesSec.server.tsx
import CoursesGridClient from "./CoursesGrid.client";
import * as db from "@/lib/db";
import type { Course } from "@/lib/types/db";

/**
 * Course columns joined with the flattened Category columns selected below.
 *
 * `tagIds` is omitted deliberately: the Course type declares it, but there is no
 * such column on the Course table — tags live in the CourseTags join model.
 * Selecting it makes MySQL reject the whole query with ER_BAD_FIELD_ERROR.
 */
type CourseWithCategoryColumns = Omit<Course, "tagIds"> & {
  categoryId: string | null;
  categorySlug: string | null;
  categoryTitle: string | null;
  categoryIcon: string | null;
};

export default async function CoursesSec() {
  try {
    // Fetch only 6 featured courses for home page
    const courses = await db.query<CourseWithCategoryColumns>(
      `SELECT 
        c.id, c.subject, c.price, c.img, c.rating, c.description, 
        c.discountPercent, c.time, c.students, c.videosCount, c.instructor,
        c.slug, c.level, c.language, c.featured, c.views, c.status,
        c.prerequisites, c.learningGoals, c.published,
        cat.id as categoryId, cat.slug as categorySlug, 
        cat.title as categoryTitle, cat.icon as categoryIcon
      FROM Course c
      LEFT JOIN Category cat ON c.categoryId = cat.id
      WHERE c.published = true
      ORDER BY c.featured DESC, c.createdAt DESC
      LIMIT 6`
    );

    // Map database results to match component expectations
    const mappedCourses = courses.map((course) => ({
      ...course,
      // The grid's type requires tagIds, but tags are a separate join table and
      // this card does not render them — so there is nothing to fetch here.
      tagIds: [] as string[],
      // LEFT JOIN, so guard on the joined columns rather than just the FK -
      // a course pointing at a missing category yields no category at all
      category:
        course.categoryId && course.categorySlug && course.categoryTitle
          ? {
              id: course.categoryId,
              slug: course.categorySlug,
              title: course.categoryTitle,
              color: null,
              icon: course.categoryIcon,
            }
          : null,
    }));

    return <CoursesGridClient courses={mappedCourses} />;
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Return empty courses array if database is not available (e.g., during build)
    return <CoursesGridClient courses={[]} />;
  }
}
