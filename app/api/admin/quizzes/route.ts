/**
 * Admin Quizzes Management API
 * GET /api/admin/quizzes - List all quizzes with pagination and filters
 * POST /api/admin/quizzes - Create a new quiz
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
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");
    const courseId = searchParams.get("courseId");
    const categoryId = searchParams.get("categoryId");
    const published = searchParams.get("published");

    // Build where clause
    const where: Prisma.QuizWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
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

    // Fetch quizzes
    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          course: {
            select: {
              id: true,
              subject: true,
              slug: true,
            },
          },
          category: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          _count: {
            select: {
              questions: true,
              attempts: true,
            },
          },
        },
      }),
      prisma.quiz.count({ where }),
    ]);

    return paginatedResponse(quizzes, page, limit, total);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return errorResponse(
      "Error fetching quizzes",
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
      description,
      courseId,
      categoryId,
      timeLimit,
      passingScore = 70,
      maxAttempts,
      shuffleQuestions = false,
      shuffleAnswers = false,
      showResults = true,
      showCorrectAnswers = true,
      published = false,
      order = 0,
    } = body;

    // Validation
    if (!title) {
      return validationError({
        title: "Title is required",
      });
    }

    // Create quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        courseId,
        categoryId,
        timeLimit,
        passingScore,
        maxAttempts,
        shuffleQuestions,
        shuffleAnswers,
        showResults,
        showCorrectAnswers,
        published,
        order,
      },
      include: {
        course: {
          select: {
            id: true,
            subject: true,
            slug: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return createdResponse(quiz, "Quiz created successfully");
  } catch (error) {
    console.error("Error creating quiz:", error);
    return errorResponse(
      "Error creating quiz",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
