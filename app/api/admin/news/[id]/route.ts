/**
 * Admin News Article Management API (Single Article)
 * GET /api/admin/news/[id] - Get news article by ID
 * PATCH /api/admin/news/[id] - Update news article
 * DELETE /api/admin/news/[id] - Delete news article
 */

import { NextRequest } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  ErrorCodes,
  noContentResponse,
} from "@/lib/api-response";
import { normalizeImageUrl } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;

    const article = await prisma.newsArticle.findUnique({
      where: { id },
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
    });

    if (!article) {
      return notFoundResponse("NewsArticle", "News article not found");
    }

    return successResponse(article);
  } catch (error) {
    console.error("Error fetching news article:", error);
    return errorResponse(
      "Error fetching news article",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;
    const body = await req.json();

    // Check if article exists
    const existingArticle = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return notFoundResponse("NewsArticle", "News article not found");
    }

    // If slug is being updated, check uniqueness
    if (body.slug && body.slug !== existingArticle.slug) {
      const slugExists = await prisma.newsArticle.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return errorResponse(
          "Article with this slug already exists",
          ErrorCodes.ALREADY_EXISTS
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.coverImage !== undefined) {
      // Normalize coverImage URL (extract original URL from Next.js optimization URLs)
      updateData.coverImage = normalizeImageUrl(body.coverImage);
    }
    if (body.author !== undefined) updateData.author = body.author;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.tagIds !== undefined) updateData.tagIds = body.tagIds;
    if (body.published !== undefined) {
      updateData.published = body.published;
      // Auto-set publishedAt when publishing
      if (body.published && !existingArticle.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (body.publishedAt !== undefined) updateData.publishedAt = new Date(body.publishedAt);
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.readingTime !== undefined) updateData.readingTime = body.readingTime;
    if (body.likes !== undefined) updateData.likes = body.likes;
    if (body.views !== undefined) updateData.views = body.views;

    const updatedArticle = await prisma.newsArticle.update({
      where: { id },
      data: updateData,
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

    return successResponse(updatedArticle, "News article updated successfully");
  } catch (error) {
    console.error("Error updating news article:", error);
    return errorResponse(
      "Error updating news article",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;

    // Check if article exists
    const existingArticle = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return notFoundResponse("NewsArticle", "News article not found");
    }

    // Delete article (cascading deletes will handle comments)
    await prisma.newsArticle.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting news article:", error);
    return errorResponse(
      "Error deleting news article",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
