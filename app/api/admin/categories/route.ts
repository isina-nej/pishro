/**
 * Admin Categories Management API
 * GET /api/admin/categories - List all categories with pagination and filters
 * POST /api/admin/categories - Create a new category
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
import { normalizeImageUrl } from "@/lib/utils";

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
    const featured = searchParams.get("featured");

    // Build where clause
    const where: Prisma.CategoryWhereInput = {};

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

    if (featured === "true") {
      where.featured = true;
    } else if (featured === "false") {
      where.featured = false;
    }

    // Fetch categories
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          tags: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
          _count: {
            select: {
              courses: true,
              content: true,
              news: true,
              faqs: true,
              comments: true,
              quizzes: true,
            },
          },
        },
      }),
      prisma.category.count({ where }),
    ]);

    return paginatedResponse(categories, page, limit, total);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return errorResponse(
      "Error fetching categories",
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
      icon,
      coverImage,
      color,
      metaTitle,
      metaDescription,
      metaKeywords = [],
      heroTitle,
      heroSubtitle,
      heroDescription,
      heroImage,
      heroCta1Text,
      heroCta1Link,
      heroCta2Text,
      heroCta2Link,
      aboutTitle1,
      aboutTitle2,
      aboutDescription,
      aboutImage,
      aboutCta1Text,
      aboutCta1Link,
      aboutCta2Text,
      aboutCta2Link,
      statsBoxes,
      enableUserLevelSection = false,
      published = true,
      featured = false,
      order = 0,
      tagIds = [],
    } = body;

    // Validation
    if (!slug || !title) {
      return validationError({
        slug: !slug ? "Slug is required" : "",
        title: !title ? "Title is required" : "",
      });
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return errorResponse(
        "Category with this slug already exists",
        ErrorCodes.ALREADY_EXISTS
      );
    }

    // Normalize image URLs (extract original URLs from Next.js optimization URLs)
    const normalizedCoverImage = normalizeImageUrl(coverImage);
    const normalizedHeroImage = normalizeImageUrl(heroImage);
    const normalizedAboutImage = normalizeImageUrl(aboutImage);

    // Create category
    const category = await prisma.category.create({
      data: {
        slug,
        title,
        description,
        icon,
        coverImage: normalizedCoverImage,
        color,
        metaTitle,
        metaDescription,
        metaKeywords,
        heroTitle,
        heroSubtitle,
        heroDescription,
        heroImage: normalizedHeroImage,
        heroCta1Text,
        heroCta1Link,
        heroCta2Text,
        heroCta2Link,
        aboutTitle1,
        aboutTitle2,
        aboutDescription,
        aboutImage: normalizedAboutImage,
        aboutCta1Text,
        aboutCta1Link,
        aboutCta2Text,
        aboutCta2Link,
        statsBoxes,
        enableUserLevelSection,
        published,
        featured,
        order,
        tagIds,
      },
      include: {
        tags: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return createdResponse(category, "Category created successfully");
  } catch (error) {
    console.error("Error creating category:", error);
    return errorResponse(
      "Error creating category",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
