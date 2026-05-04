/**
 * Admin Quiz Management API (Single Quiz)
 * GET /api/admin/quizzes/[id] - Get quiz by ID
 * PATCH /api/admin/quizzes/[id] - Update quiz
 * DELETE /api/admin/quizzes/[id] - Delete quiz
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  ErrorCodes,
  noContentResponse
} from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();\nif (!session?.user) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Access denied. Admin only.", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
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
        },
        questions: {
          orderBy: { order: "asc" }
        },
        _count: {
          select: {
            questions: true,
            attempts: true
          }
        }
      }
    });

    if (!quiz) {
      return notFoundResponse("Quiz", "Quiz not found");
    }

    return successResponse(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return errorResponse(
      "Error fetching quiz",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();\nif (!session?.user) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Access denied. Admin only.", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const body = await req.json();

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id }
    });

    if (!existingQuiz) {
      return notFoundResponse("Quiz", "Quiz not found");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.courseId !== undefined) updateData.courseId = body.courseId;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.timeLimit !== undefined) updateData.timeLimit = body.timeLimit;
    if (body.passingScore !== undefined) updateData.passingScore = body.passingScore;
    if (body.maxAttempts !== undefined) updateData.maxAttempts = body.maxAttempts;
    if (body.shuffleQuestions !== undefined) updateData.shuffleQuestions = body.shuffleQuestions;
    if (body.shuffleAnswers !== undefined) updateData.shuffleAnswers = body.shuffleAnswers;
    if (body.showResults !== undefined) updateData.showResults = body.showResults;
    if (body.showCorrectAnswers !== undefined) updateData.showCorrectAnswers = body.showCorrectAnswers;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.order !== undefined) updateData.order = body.order;

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: updateData,
      include: {
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

    return successResponse(updatedQuiz, "Quiz updated successfully");
  } catch (error) {
    console.error("Error updating quiz:", error);
    return errorResponse(
      "Error updating quiz",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();\nif (!session?.user) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Access denied. Admin only.", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id }
    });

    if (!existingQuiz) {
      return notFoundResponse("Quiz", "Quiz not found");
    }

    // Delete quiz (cascading deletes will handle questions and attempts)
    await prisma.quiz.delete({
      where: { id }
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return errorResponse(
      "Error deleting quiz",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
