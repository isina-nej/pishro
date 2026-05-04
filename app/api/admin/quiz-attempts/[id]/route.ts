/**
 * Admin Quiz Attempt Management API (Single Attempt)
 * GET /api/admin/quiz-attempts/[id] - Get quiz attempt by ID
 * DELETE /api/admin/quiz-attempts/[id] - Delete quiz attempt
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

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id },
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
    });

    if (!attempt) {
      return notFoundResponse("QuizAttempt", "Quiz attempt not found");
    }

    return successResponse(attempt);
  } catch (error) {
    console.error("Error fetching quiz attempt:", error);
    return errorResponse(
      "Error fetching quiz attempt",
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

    // Check if attempt exists
    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: { id }
    });

    if (!existingAttempt) {
      return notFoundResponse("QuizAttempt", "Quiz attempt not found");
    }

    // Delete attempt
    await prisma.quizAttempt.delete({
      where: { id }
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting quiz attempt:", error);
    return errorResponse(
      "Error deleting quiz attempt",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
