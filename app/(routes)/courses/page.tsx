import { Metadata } from "next";
import { Suspense } from "react";
import { query } from "@/lib/db";
import CoursesPageContent from "@/components/courses/coursesPageContent";
import type { Course, Category } from "@/lib/types/db";
import { CourseLevel, CourseStatus, Language } from "@/lib/types/db";

export const metadata: Metadata = {
  title: "همه دوره‌ها | پیشرو",
  description: "مشاهده همه دوره‌های آموزشی پیشرو در یک صفحه",
};

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

interface CourseRow {
  id: string;
  subject: string;
  price: number;
  img: string | null;
  rating: number | null;
  description: string | null;
  discountPercent: number | null;
  time: string | null;
  students: number | null;
  videosCount: number | null;
  instructor: string | null;
  slug: string | null;
  categoryId: string | null;
  level: string | null;
  status: string;
  published: number; // MySQL returns 1/0
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface CategoryRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  published: number; // MySQL returns 1/0
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Helper to convert MySQL row to Course type
function convertCourse(row: CourseRow): Course {
  return {
    id: row.id,
    subject: row.subject,
    price: row.price,
    img: row.img || undefined,
    rating: row.rating || undefined,
    description: row.description || undefined,
    discountPercent: row.discountPercent || undefined,
    time: row.time || undefined,
    students: row.students || undefined,
    videosCount: row.videosCount || undefined,
    createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    categoryId: row.categoryId || undefined,
    slug: row.slug || undefined,
    level: (row.level as CourseLevel) || undefined,
    language: Language.FA,
    prerequisites: [],
    learningGoals: [],
    instructor: row.instructor || undefined,
    status: CourseStatus.ACTIVE,
    published: !!row.published,
    featured: false,
    views: 0,
    tagIds: [],
  };
}

// Helper to convert MySQL row to Category type
function convertCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || undefined,
    icon: row.icon || undefined,
    published: !!row.published,
    featured: false,
    order: row.order,
    tagIds: [],
    metaKeywords: [],
  };
}

async function getCoursesGroupedByCategory() {
  try {
    // Fetch all published categories
    const categories = await query<CategoryRow>(
      `SELECT id, slug, title, description, icon, published, \`order\`, createdAt, updatedAt
       FROM Category 
       WHERE published = true 
       ORDER BY \`order\` ASC`
    );

    // For each category, fetch its published courses
    const categoriesWithCourses = await Promise.all(
      (categories || []).map(async (categoryRow) => {
        const courseRows = await query<CourseRow>(
          `SELECT id, subject, price, img, rating, description, discountPercent, time, students, 
                  videosCount, instructor, slug, categoryId, level, status, published, createdAt, updatedAt
           FROM Course 
           WHERE categoryId = ? AND published = true 
           ORDER BY createdAt DESC`,
          [categoryRow.id]
        );

        const courses = (courseRows || []).map(convertCourse);
        const category = convertCategory(categoryRow);

        return {
          ...category,
          courses,
        };
      })
    );

    // Also fetch courses without a category or with uncategorized ones
    const uncategorizedRows = await query<CourseRow>(
      `SELECT id, subject, price, img, rating, description, discountPercent, time, students, 
              videosCount, instructor, slug, categoryId, level, status, published, createdAt, updatedAt
       FROM Course 
       WHERE (categoryId IS NULL OR categoryId = '') AND published = true 
       ORDER BY createdAt DESC`
    );

    // If there are uncategorized courses, add them to a special "Other" category
    if (uncategorizedRows && uncategorizedRows.length > 0) {
      categoriesWithCourses.push({
        id: 'uncategorized',
        slug: 'uncategorized',
        title: 'سایر دوره‌ها',
        description: undefined,
        icon: undefined,
        published: true,
        featured: false,
        order: 999,
        tagIds: [],
        metaKeywords: [],
        courses: uncategorizedRows.map(convertCourse),
      });
    }

    return categoriesWithCourses;
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    return [];
  }
}

export default async function AllCoursesPage() {
  const categoriesWithCourses = await getCoursesGroupedByCategory();

  return (
    <main className="public-page-shell w-full">
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myPrimary" />
          </div>
        }
      >
        <CoursesPageContent categoriesWithCourses={categoriesWithCourses} />
      </Suspense>
    </main>
  );
}
