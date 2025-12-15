/**
 * Admin Enrollments Management API
 * GET /api/admin/enrollments - List all enrollments with pagination and filters
 * POST /api/admin/enrollments - Manually create an enrollment
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
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");
    const completed = searchParams.get("completed");

    // Build where clause
    const where: Prisma.EnrollmentWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    if (completed === "true") {
      where.completedAt = { not: null };
    } else if (completed === "false") {
      where.completedAt = null;
    }

    // Fetch enrollments
    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { enrolledAt: "desc" },
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
              img: true,
            },
          },
        },
      }),
      prisma.enrollment.count({ where }),
    ]);

    return paginatedResponse(enrollments, page, limit, total);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return errorResponse(
      "Error fetching enrollments",
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
      userId,
      courseId,
      progress = 0,
    } = body;

    // Validation
    if (!userId || !courseId) {
      return validationError({
        userId: !userId ? "User ID is required" : "",
        courseId: !courseId ? "Course ID is required" : "",
      });
    }

    // Check if enrollment already exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return errorResponse(
        "User is already enrolled in this course",
        ErrorCodes.ALREADY_EXISTS
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        progress,
      },
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

    return createdResponse(enrollment, "Enrollment created successfully");
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return errorResponse(
      "Error creating enrollment",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
