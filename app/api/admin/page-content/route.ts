/**
 * Admin Page Content Management API
 * GET /api/admin/page-content - List all page content with pagination and filters
 * POST /api/admin/page-content - Create new page content
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  unauthorizedResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  forbiddenResponse,
  validationError,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
    const skip = (page - 1) * limit;

    // Filters
    const categoryId = searchParams.get("categoryId");
    const type = searchParams.get("type");
    const published = searchParams.get("published");

    // Build where clause
    const where: Prisma.PageContentWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (type && ["LANDING", "ABOUT", "FEATURES", "FAQ", "TESTIMONIAL", "HERO", "STATS"].includes(type)) {
      where.type = type as Prisma.EnumPageContentTypeFilter;
    }

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    // Fetch page content
    const [content, total] = await Promise.all([
      prisma.pageContent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          category: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
        },
      }),
      prisma.pageContent.count({ where }),
    ]);

    return paginatedResponse(content, page, limit, total);
  } catch (error) {
    console.error("Error fetching page content:", error);
    return errorResponse(
      "Error fetching page content",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const body = await req.json();
    const {
      categoryId,
      type,
      section,
      title,
      subtitle,
      content,
      language = "FA",
      order = 0,
      published = true,
      publishAt,
      expireAt,
    } = body;

    // Validation
    if (!categoryId || !type || !content) {
      return validationError({
        categoryId: !categoryId ? "Category ID is required" : "",
        type: !type ? "Type is required" : "",
        content: !content ? "Content is required" : "",
      });
    }

    // Create page content
    const pageContent = await prisma.pageContent.create({
      data: {
        categoryId,
        type,
        section,
        title,
        subtitle,
        content,
        language,
        order,
        published,
        publishAt: publishAt ? new Date(publishAt) : null,
        expireAt: expireAt ? new Date(expireAt) : null,
      },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return createdResponse(pageContent, "Page content created successfully");
  } catch (error) {
    console.error("Error creating page content:", error);
    return errorResponse(
      "Error creating page content",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
