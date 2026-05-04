/**
 * Admin Quiz Attempts Management API
 * GET /api/admin/quiz-attempts - List quiz attempts with filters
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
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Access denied. Admin only.", ErrorCodes.UNAUTHORIZED);
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
    const skip = (page - 1) * limit;

    // Filters
    const quizId = searchParams.get("quizId");
    const userId = searchParams.get("userId");
    const passed = searchParams.get("passed");

    // Build where clause
    const where: Prisma.QuizAttemptWhereInput = {};

    if (quizId) {
      where.quizId = quizId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (passed === "true") {
      where.passed = true;
    } else if (passed === "false") {
      where.passed = false;
    }

    // Fetch attempts
    const [attempts, total] = await Promise.all([
      prisma.quizAttempt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startedAt: "desc" },
        include: {
          quiz: {
            select: {
              id: true,
              title: true
            }
          },
          user: {
            select: {
              id: true,
              phone: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }),
      prisma.quizAttempt.count({ where }),
    ]);

    return paginatedResponse(attempts, page, limit, total);
  } catch (error) {
    console.error("Error fetching quiz attempts:", error);
    return errorResponse(
      "Error fetching quiz attempts",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
