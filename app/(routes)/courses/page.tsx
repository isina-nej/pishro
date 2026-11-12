import { Metadata } from "next";
import { query } from "@/lib/db";
import CoursesPageContent from "@/components/courses/coursesPageContent";
import type { Category } from "@/lib/types/db";

export const metadata: Metadata = {
  title: "همه دوره‌ها | پیشرو",
  description: "مشاهده همه دوره‌های آموزشی پیشرو در یک صفحه",
  alternates: { canonical: "/courses" },
  openGraph: {
    title: "همه دوره‌ها | پیشرو",
    description: "مشاهده همه دوره‌های آموزشی پیشرو در یک صفحه",
    type: "website",
  },
};

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

interface CourseRow {
  id: string;
  categoryId: string | null;
  rating: number | null;
  students: number | null;
  published: number;
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

// Only these four fields are needed for the public hero stats and link mapping.
// Course cards themselves come from the paginated API and must not be serialized twice.
function convertCourseIndex(row: CourseRow) {
  return {
    id: row.id,
    rating: row.rating || 0,
    students: row.students || 0,
    published: Boolean(row.published),
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
    // Two concurrent reads instead of N+2 queries (one SQL request per category).
    // This prevents DB connection-pool pressure as categories grow.
    const [categories, publishedRows] = await Promise.all([
      query<CategoryRow>(`
        SELECT id, slug, title, description, icon, published, \`order\`, createdAt, updatedAt
        FROM Category
        WHERE published = true
        ORDER BY \`order\` ASC
      `),
      query<CourseRow>(`
        SELECT id, categoryId, rating, students, published
        FROM Course
        WHERE published = true
        ORDER BY createdAt DESC
      `),
    ]);

    const grouped = new Map<string, ReturnType<typeof convertCourseIndex>[]>();
    for (const category of categories) grouped.set(category.id, []);
    const uncategorized: ReturnType<typeof convertCourseIndex>[] = [];

    for (const row of publishedRows) {
      const course = convertCourseIndex(row);
      if (row.categoryId && grouped.has(row.categoryId)) {
        grouped.get(row.categoryId)!.push(course);
      } else if (!row.categoryId) {
        uncategorized.push(course);
      }
    }

    const result = categories.map((row) => ({
      ...convertCategory(row),
      courses: grouped.get(row.id) ?? [],
    }));

    if (uncategorized.length) {
      result.push({
        id: "uncategorized",
        slug: "uncategorized",
        title: "سایر دوره‌ها",
        description: undefined,
        icon: undefined,
        published: true,
        featured: false,
        order: 999,
        tagIds: [],
        metaKeywords: [],
        courses: uncategorized,
      });
    }
    return result;
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    return [];
  }
}

export default async function AllCoursesPage() {
  const categoriesWithCourses = await getCoursesGroupedByCategory();

  return (
    <main className="public-page-shell w-full">
      <CoursesPageContent categoriesWithCourses={categoriesWithCourses} />
    </main>
  );
}
