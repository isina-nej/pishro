/**
 * Admin Enrollment Management API (Single Enrollment)
 * GET /api/admin/enrollments/[id] - Get enrollment by ID
 * PATCH /api/admin/enrollments/[id] - Update enrollment
 * DELETE /api/admin/enrollments/[id] - Delete enrollment
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

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            subject: true,
            slug: true,
            img: true,
            description: true,
          },
        },
      },
    });

    if (!enrollment) {
      return notFoundResponse("Enrollment", "Enrollment not found");
    }

    return successResponse(enrollment);
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return errorResponse(
      "Error fetching enrollment",
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

    // Check if enrollment exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!existingEnrollment) {
      return notFoundResponse("Enrollment", "Enrollment not found");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.progress !== undefined) updateData.progress = body.progress;
    if (body.completedAt !== undefined) {
      updateData.completedAt = body.completedAt ? new Date(body.completedAt) : null;
    }
    if (body.lastAccessAt !== undefined) {
      updateData.lastAccessAt = body.lastAccessAt ? new Date(body.lastAccessAt) : null;
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            subject: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(updatedEnrollment, "Enrollment updated successfully");
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return errorResponse(
      "Error updating enrollment",
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

    // Check if enrollment exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!existingEnrollment) {
      return notFoundResponse("Enrollment", "Enrollment not found");
    }

    // Delete enrollment
    await prisma.enrollment.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return errorResponse(
      "Error deleting enrollment",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
