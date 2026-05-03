/**
 * Admin Quiz Question Management API (Single Question)
 * GET /api/admin/quiz-questions/[id] - Get quiz question by ID
 * PATCH /api/admin/quiz-questions/[id] - Update quiz question
 * DELETE /api/admin/quiz-questions/[id] - Delete quiz question
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

    const question = await prisma.quizQuestion.findUnique({
      where: { id },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!question) {
      return notFoundResponse("QuizQuestion", "Quiz question not found");
    }

    return successResponse(question);
  } catch (error) {
    console.error("Error fetching quiz question:", error);
    return errorResponse(
      "Error fetching quiz question",
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

    // Check if question exists
    const existingQuestion = await prisma.quizQuestion.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return notFoundResponse("QuizQuestion", "Quiz question not found");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.question !== undefined) updateData.question = body.question;
    if (body.questionType !== undefined) updateData.questionType = body.questionType;
    if (body.options !== undefined) updateData.options = body.options;
    if (body.correctAnswer !== undefined) updateData.correctAnswer = body.correctAnswer;
    if (body.explanation !== undefined) updateData.explanation = body.explanation;
    if (body.points !== undefined) updateData.points = body.points;
    if (body.order !== undefined) updateData.order = body.order;

    const updatedQuestion = await prisma.quizQuestion.update({
      where: { id },
      data: updateData,
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return successResponse(updatedQuestion, "Quiz question updated successfully");
  } catch (error) {
    console.error("Error updating quiz question:", error);
    return errorResponse(
      "Error updating quiz question",
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

    // Check if question exists
    const existingQuestion = await prisma.quizQuestion.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return notFoundResponse("QuizQuestion", "Quiz question not found");
    }

    // Delete question
    await prisma.quizQuestion.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting quiz question:", error);
    return errorResponse(
      "Error deleting quiz question",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
