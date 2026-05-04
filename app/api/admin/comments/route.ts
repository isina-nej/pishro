/**
 * Admin Comments Management API
 * GET /api/admin/comments - List all comments with pagination and filters
 * POST /api/admin/comments - Create a new comment (testimonial)
 */

import { NextRequest } from "next/server";
import { Prisma } from "@/types/prisma";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  validationError
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();\nif (!session?.user) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Access denied. Admin only.", ErrorCodes.UNAUTHORIZED);
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");
    const courseId = searchParams.get("courseId");
    const categoryId = searchParams.get("categoryId");
    const published = searchParams.get("published");
    const verified = searchParams.get("verified");
    const featured = searchParams.get("featured");

    // Build where clause
    const where: Prisma.CommentWhereInput = {};

    if (search) {
      where.OR = [
        { text: { contains: search, mode: "insensitive" } },
        { userName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (courseId) {
      where.courseId = courseId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    if (verified === "true") {
      where.verified = true;
    } else if (verified === "false") {
      where.verified = false;
    }

    if (featured === "true") {
      where.featured = true;
    } else if (featured === "false") {
      where.featured = false;
    }

    // Fetch comments
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
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
          course: {
            select: {
              id: true,
              subject: true,
              slug: true
            }
          },
          category: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          }
        }
      }),
      prisma.comment.count({ where }),
    ]);

    return paginatedResponse(comments, page, limit, total);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return errorResponse(
      "Error fetching comments",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();\nif (!session?.user) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Access denied. Admin only.", ErrorCodes.UNAUTHORIZED);
    }

    const body = await req.json();
    const {
      text,
      rating,
      userId,
      userName,
      userAvatar,
      userRole,
      userCompany,
      courseId,
      categoryId,
      published = false,
      verified = false,
      featured = false
    } = body;

    // Validation
    if (!text) {
      return validationError({
        text: "Comment text is required"
      });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        text,
        rating,
        userId,
        userName,
        userAvatar,
        userRole,
        userCompany,
        courseId,
        categoryId,
        published,
        verified,
        featured
      },
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
        course: {
          select: {
            id: true,
            subject: true,
            slug: true
          }
        },
        category: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });

    return createdResponse(comment, "Comment created successfully");
  } catch (error) {
    console.error("Error creating comment:", error);
    return errorResponse(
      "Error creating comment",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
