/**
 * Admin News Comments Management API
 * GET /api/admin/news-comments - List all news comments with pagination and filters
 */

import { NextRequest } from "next/server";
import { Prisma } from "@/types/prisma";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  ErrorCodes
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    if (!session?.user) {
      return "Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return "Access denied. Admin only.");
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");
    const articleId = searchParams.get("articleId");
    const userId = searchParams.get("userId");

    // Build where clause
    const where: Prisma.NewsCommentWhereInput = {};

    if (search) {
      where.content = { contains: search, mode: "insensitive" };
    }

    if (articleId) {
      where.articleId = articleId;
    }

    if (userId) {
      where.userId = userId;
    }

    // Fetch comments
    const [comments, total] = await Promise.all([
      prisma.newsComment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              phone: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          },
          article: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          }
        }
      }),
      prisma.newsComment.count({ where }),
    ]);

    return paginatedResponse(comments, page, limit, total);
  } catch (error) {
    console.error("Error fetching news comments:", error);
    return errorResponse(
      "Error fetching news comments",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
