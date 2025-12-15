/**
 * Admin Quiz Questions Management API
 * GET /api/admin/quiz-questions - List quiz questions with filters
 * POST /api/admin/quiz-questions - Create a new quiz question
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
    const quizId = searchParams.get("quizId");
    const search = searchParams.get("search");

    // Build where clause
    const where: Prisma.QuizQuestionWhereInput = {};

    if (quizId) {
      where.quizId = quizId;
    }

    if (search) {
      where.question = { contains: search, mode: "insensitive" };
    }

    // Fetch questions
    const [questions, total] = await Promise.all([
      prisma.quizQuestion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      prisma.quizQuestion.count({ where }),
    ]);

    return paginatedResponse(questions, page, limit, total);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return errorResponse(
      "Error fetching quiz questions",
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
      quizId,
      question,
      questionType = "MULTIPLE_CHOICE",
      options,
      correctAnswer,
      explanation,
      points = 1,
      order = 0,
    } = body;

    // Validation
    if (!quizId || !question) {
      return validationError({
        quizId: !quizId ? "Quiz ID is required" : "",
        question: !question ? "Question is required" : "",
      });
    }

    // Create question
    const quizQuestion = await prisma.quizQuestion.create({
      data: {
        quizId,
        question,
        questionType,
        options: options || [],
        correctAnswer,
        explanation,
        points,
        order,
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return createdResponse(quizQuestion, "Quiz question created successfully");
  } catch (error) {
    console.error("Error creating quiz question:", error);
    return errorResponse(
      "Error creating quiz question",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
