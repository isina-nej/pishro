import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await query<any>(
      `SELECT id, slug, title, published FROM Category LIMIT 10`
    );

    const courses = await query<any>(
      `SELECT id, subject, categoryId, published FROM Course LIMIT 10`
    );

    const courseCategories = await query<any>(
      `SELECT COUNT(*) as total FROM Course WHERE categoryId IS NOT NULL AND != ''`
    );

    const uncategorized = await query<any>(
      `SELECT COUNT(*) as total FROM Course WHERE categoryId IS NULL OR = ''`
    );

    return NextResponse.json({
      categories: {
        total: categories.length,
        items: categories,
      },
      courses: {
        total: courses.length,
        items: courses,
        withCategory: courseCategories[0]?.total || 0,
        withoutCategory: uncategorized[0]?.total || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
