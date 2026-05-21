// app/components/utils/CoursesSec.server.tsx
import CoursesGridClient from "./CoursesGrid.client";
import * as db from "@/lib/db";

export default async function CoursesSec() {
  try {
    // Fetch only 6 featured courses for home page
    const courses = await db.query<any>(
      `SELECT 
        c.id, c.subject, c.price, c.img, c.rating, c.description, 
        c.discountPercent, c.time, c.students, c.videosCount, c.instructor,
        c.slug, c.level, c.language, c.featured, c.views, c.status,
        cat.id as categoryId, cat.slug as categorySlug, 
        cat.title as categoryTitle, cat.icon as categoryIcon
      FROM Course c
      LEFT JOIN Category cat ON c.categoryId = cat.id
      WHERE c.published = true
      ORDER BY c.featured DESC, c.createdAt DESC
      LIMIT 6`
    );

    // Map database results to match component expectations
    const mappedCourses = courses.map((course: any) => ({
      ...course,
      category: course.categoryId ? {
        id: course.categoryId,
        slug: course.categorySlug,
        title: course.categoryTitle,
        color: null,
        icon: course.categoryIcon,
      } : null,
    }));

    return <CoursesGridClient courses={mappedCourses} />;
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Return empty courses array if database is not available (e.g., during build)
    return <CoursesGridClient courses={[]} />;
  }
}
