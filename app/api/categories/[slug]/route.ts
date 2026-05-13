/**
 * Category API Route
 * GET /api/categories/[slug]
 * Fetches category data with all related content for dynamic pages
 */

import { NextRequest } from "next/server";
import { CourseLevel } from "@prisma/client";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  ErrorCodes,
} from "@/lib/api-response";
import {
  getCategoryBySlug,
  getCategoryTags,
  getCategoryFAQs,
  getCategoryComments,
  getCategoryCourses,
} from "@/lib/services/category-service";

export const revalidate = 3600; // ISR: Revalidate every 1 hour

/**
 * GET category by slug with optional filters
 * Query params:
 * - include: Comma-separated list of relations to include (tags,faqs,comments,courses)
 * - limit: Limit for courses, tags, faqs, comments
 * - page: Page number for courses
 * - level: Filter courses by level
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = req.nextUrl.searchParams;

    // Parse query parameters
    const include = searchParams.get("include")?.split(",") || [
      "tags",
      "faqs",
      "comments",
      "courses",
    ];
    const limit = parseInt(searchParams.get("limit") || "12");
    const page = parseInt(searchParams.get("page") || "1");
    const level = searchParams.get("level") as CourseLevel | null;

    // Fetch category with basic data
    const category = await getCategoryBySlug(slug);

    if (!category) {
      return notFoundResponse(`دسته‌بندی با شناسه ${slug} یافت نشد`);
    }

    // Build response based on include parameter
    const response: Record<string, unknown> = {
      id: category.id,
      slug: category.slug,
      title: category.title,
      description: category.description,
      icon: category.icon,
      coverImage: category.coverImage,
      color: category.color,
      metaTitle: category.metaTitle,
      metaDescription: category.metaDescription,
      metaKeywords: category.metaKeywords,
      featured: category.featured,
      order: category.order,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    // Add page content
    if (include.includes("content") || include.includes("all")) {
      response.content = category.content;
    }

    // Add tags
    if (include.includes("tags") || include.includes("all")) {
      response.tags = await getCategoryTags(slug, limit);
    }

    // Add FAQs
    if (include.includes("faqs") || include.includes("all")) {
      response.faqs = await getCategoryFAQs(slug, limit);
    }

    // Add comments (testimonials)
    if (include.includes("comments") || include.includes("testimonials") || include.includes("all")) {
      response.comments = await getCategoryComments(slug, limit);
    }

    // Add courses with pagination
    if (include.includes("courses") || include.includes("all")) {
      const coursesData = await getCategoryCourses(slug, {
        page,
        limit,
        level: level || undefined,
      });
      response.courses = coursesData.courses;
      response.pagination = coursesData.pagination;
    }

    return successResponse(response);
  } catch (error) {
    console.error("Error fetching category:", error);
    return errorResponse(
      "خطا در دریافت اطلاعات دسته‌بندی",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
