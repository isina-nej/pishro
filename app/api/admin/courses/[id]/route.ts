/**
 * Admin Course Management API (Single Course)
 * GET /api/admin/courses/[id] - Get course by ID
 * PATCH /api/admin/courses/[id] - Update course
 * DELETE /api/admin/courses/[id] - Delete course
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
import { normalizeImageUrl } from "@/lib/utils";

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

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        relatedTags: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        _count: {
          select: {
            comments: true,
            enrollments: true,
            orderItems: true,
            quizzes: true,
          },
        },
      },
    });

    if (!course) {
      return notFoundResponse("Course", "Course not found");
    }

    return successResponse(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return errorResponse(
      "Error fetching course",
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

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return notFoundResponse("Course", "Course not found");
    }

    // If slug is being updated, check uniqueness
    if (body.slug && body.slug !== existingCourse.slug) {
      const slugExists = await prisma.course.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return errorResponse(
          "Course with this slug already exists",
          ErrorCodes.ALREADY_EXISTS
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.subject !== undefined) updateData.subject = body.subject;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.img !== undefined) {
      // Normalize img URL (extract original URL from Next.js optimization URLs)
      updateData.img = normalizeImageUrl(body.img);
    }
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.discountPercent !== undefined) updateData.discountPercent = body.discountPercent;
    if (body.time !== undefined) updateData.time = body.time;
    if (body.students !== undefined) updateData.students = body.students;
    if (body.videosCount !== undefined) updateData.videosCount = body.videosCount;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.tagIds !== undefined) updateData.tagIds = body.tagIds;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.level !== undefined) updateData.level = body.level;
    if (body.language !== undefined) updateData.language = body.language;
    if (body.prerequisites !== undefined) updateData.prerequisites = body.prerequisites;
    if (body.learningGoals !== undefined) updateData.learningGoals = body.learningGoals;
    if (body.instructor !== undefined) updateData.instructor = body.instructor;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.views !== undefined) updateData.views = body.views;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        relatedTags: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return successResponse(updatedCourse, "Course updated successfully");
  } catch (error) {
    console.error("Error updating course:", error);
    return errorResponse(
      "Error updating course",
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

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return notFoundResponse("Course", "Course not found");
    }

    // Delete course (cascading deletes will handle related records)
    await prisma.course.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting course:", error);
    return errorResponse(
      "Error deleting course",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
