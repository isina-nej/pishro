/**
 * Admin Quiz Attempt Management API (Single Attempt)
 * GET /api/admin/quiz-attempts/[id] - Get quiz attempt by ID
 * DELETE /api/admin/quiz-attempts/[id] - Delete quiz attempt
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

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            phone: true,
            firstName: true,
            lastName: true,
          },
        },
      },
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
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;

    // Check if attempt exists
    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: { id },
    });

    if (!existingAttempt) {
      return notFoundResponse("QuizAttempt", "Quiz attempt not found");
    }

    // Delete attempt
    await prisma.quizAttempt.delete({
      where: { id },
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
