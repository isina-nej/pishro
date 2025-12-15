/**
 * Admin Tags Management API
 * GET /api/admin/tags - List all tags with pagination and filters
 * POST /api/admin/tags - Create a new tag
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
    const search = searchParams.get("search");
    const published = searchParams.get("published");

    // Build where clause
    const where: Prisma.TagWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    // Fetch tags
    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        skip,
        take: limit,
        orderBy: { usageCount: "desc" },
        include: {
          _count: {
            select: {
              categories: true,
              courses: true,
              news: true,
              books: true,
            },
          },
        },
      }),
      prisma.tag.count({ where }),
    ]);

    return paginatedResponse(tags, page, limit, total);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return errorResponse(
      "Error fetching tags",
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
      slug,
      title,
      description,
      color,
      icon,
      published = false,
      seoTitle,
      seoDescription,
    } = body;

    // Validation
    if (!slug || !title) {
      return validationError({
        slug: !slug ? "Slug is required" : "",
        title: !title ? "Title is required" : "",
      });
    }

    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return errorResponse(
        "Tag with this slug already exists",
        ErrorCodes.ALREADY_EXISTS
      );
    }

    // Create tag
    const tag = await prisma.tag.create({
      data: {
        slug,
        title,
        description,
        color,
        icon,
        published,
        seoTitle,
        seoDescription,
      },
    });

    return createdResponse(tag, "Tag created successfully");
  } catch (error) {
    console.error("Error creating tag:", error);
    return errorResponse(
      "Error creating tag",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
