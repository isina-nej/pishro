/**
 * Admin News Management API
 * GET /api/admin/news - List all news articles with pagination and filters (admin view)
 * POST /api/admin/news - Create a new news article
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
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const published = searchParams.get("published");
    const featured = searchParams.get("featured");

    // Build where clause
    const where: Prisma.NewsArticleWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
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

    // Fetch news articles
    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          relatedCategory: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
          relatedTags: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.newsArticle.count({ where }),
    ]);

    return paginatedResponse(articles, page, limit, total);
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return errorResponse(
      "Error fetching news articles",
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
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      category,
      tags = [],
      categoryId,
      tagIds = [],
      published = false,
      publishedAt,
      featured = false,
      readingTime,
    } = body;

    // Validation
    if (!title || !slug || !excerpt || !content) {
      return validationError({
        title: !title ? "Title is required" : "",
        slug: !slug ? "Slug is required" : "",
        excerpt: !excerpt ? "Excerpt is required" : "",
        content: !content ? "Content is required" : "",
      });
    }

    // Check if slug already exists
    const existingArticle = await prisma.newsArticle.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return errorResponse(
        "Article with this slug already exists",
        ErrorCodes.ALREADY_EXISTS
      );
    }

    // Normalize coverImage URL (extract original URL from Next.js optimization URLs)
    const normalizedCoverImage = normalizeImageUrl(coverImage);

    // Create article
    const article = await prisma.newsArticle.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: normalizedCoverImage,
        author,
        category: category || "",
        tags,
        categoryId,
        tagIds,
        published,
        publishedAt: published ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
        featured,
        readingTime,
      },
      include: {
        relatedCategory: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        relatedTags: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return createdResponse(article, "News article created successfully");
  } catch (error) {
    console.error("Error creating news article:", error);
    return errorResponse(
      "Error creating news article",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
