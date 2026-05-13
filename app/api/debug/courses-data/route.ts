import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import type { Course, Category } from "@/lib/types/db";

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
  published: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface CategoryRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  published: number;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

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
    level: (row.level as any) || undefined,
    language: 'FA' as any,
    prerequisites: [],
    learningGoals: [],
    instructor: row.instructor || undefined,
    status: 'ACTIVE' as any,
    published: !!row.published,
    featured: false,
    views: 0,
    tagIds: [],
  };
}

function convertCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || undefined,
    icon: row.icon || undefined,
    coverImage: undefined,
    color: undefined,
    metaTitle: undefined,
    metaDescription: undefined,
    metaKeywords: [],
    heroTitle: undefined,
    heroSubtitle: undefined,
    heroDescription: undefined,
    heroImage: undefined,
    published: !!row.published,
    featured: false,
    order: row.order,
    tagIds: [],
  };
}

export async function GET() {
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

    // Also fetch courses without a category
    const uncategorizedRows = await query<CourseRow>(
      `SELECT id, subject, price, img, rating, description, discountPercent, time, students, 
              videosCount, instructor, slug, categoryId, level, status, published, createdAt, updatedAt
       FROM Course 
       WHERE (categoryId IS NULL OR categoryId = '') AND published = true 
       ORDER BY createdAt DESC`
    );

    if (uncategorizedRows && uncategorizedRows.length > 0) {
      categoriesWithCourses.push({
        id: 'uncategorized',
        slug: 'uncategorized',
        title: 'سایر دوره‌ها',
        description: undefined,
        icon: undefined,
        coverImage: undefined,
        color: undefined,
        metaTitle: undefined,
        metaDescription: undefined,
        metaKeywords: [],
        heroTitle: undefined,
        heroSubtitle: undefined,
        heroDescription: undefined,
        heroImage: undefined,
        published: true,
        featured: false,
        order: 999,
        tagIds: [],
        courses: uncategorizedRows.map(convertCourse),
      });
    }

    return NextResponse.json({
      totalCategories: categoriesWithCourses.length,
      categories: categoriesWithCourses.map(cat => ({
        id: cat.id,
        title: cat.title,
        courseCount: cat.courses.length,
        publishedCheck: cat.courses.map(c => ({
          id: c.id,
          subject: c.subject,
          published: c.published,
          publishedType: typeof c.published,
        })),
      })),
      fullData: categoriesWithCourses,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
