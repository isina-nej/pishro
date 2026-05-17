/**
 * Admin Course Management API (Single Course)
 * GET /api/admin/courses/[id] - Get course by ID
 * PATCH /api/admin/courses/[id] - Update course
 * DELETE /api/admin/courses/[id] - Delete course
 */

import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";

import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  ErrorCodes,
  noContentResponse
} from "@/lib/api-response";
import { normalizeImageUrl } from "@/lib/utils";
import { CourseUpdateSchema } from "@/lib/schemas/course-management-schema";
import {
  buildCourseThumbnailPath,
  buildCourseTrailerPath,
  replaceStorageFile,
  safeDeleteStoragePath,
} from "@/lib/course-media";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true
          }
        },
        tags: { include: { tag: true } },
        _count: {
          select: {
            comments: true,
            enrollments: true,
            orderItems: true,
            quizzes: true
          }
        }
      }
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
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const rawBody = await req.json();
    const mapped = {
      ...rawBody,
      title: rawBody.title ?? rawBody.subject,
      cost: rawBody.cost ?? rawBody.price,
      thumbnailPath: rawBody.thumbnailPath ?? rawBody.img,
      trailerVideoPath: rawBody.trailerVideoPath ?? rawBody.introVideoUrl,
    };
    const parsed = CourseUpdateSchema.safeParse(mapped);

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return notFoundResponse("Course", "Course not found");
    }

    const body = parsed.success ? parsed.data : rawBody;

    // If slug is being updated, check uniqueness
    if (rawBody.slug && rawBody.slug !== existingCourse.slug) {
      const slugExists = await prisma.course.findUnique({
        where: { slug: rawBody.slug }
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
    if (body.title !== undefined || rawBody.subject !== undefined) {
      updateData.subject = body.title ?? rawBody.subject;
    }
    if (body.cost !== undefined || rawBody.price !== undefined) {
      updateData.price = body.cost ?? rawBody.price;
    }
    if (body.likes !== undefined) updateData.likes = body.likes;
    if (body.dislikes !== undefined) updateData.dislikes = body.dislikes;
    if (body.hasChapters !== undefined) updateData.hasChapters = body.hasChapters;
    if (rawBody.img !== undefined && !body.thumbnailTempPath) {
      updateData.img = normalizeImageUrl(rawBody.img);
    }
    if (body.description !== undefined) updateData.description = body.description;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (rawBody.rating !== undefined) updateData.rating = rawBody.rating;
    if (rawBody.discountPercent !== undefined) updateData.discountPercent = rawBody.discountPercent;
    if (rawBody.time !== undefined) updateData.time = rawBody.time;
    if (rawBody.students !== undefined) updateData.students = rawBody.students;
    if (rawBody.videosCount !== undefined) updateData.videosCount = rawBody.videosCount;
    if (rawBody.slug !== undefined) updateData.slug = rawBody.slug;
    if (rawBody.level !== undefined) updateData.level = rawBody.level;
    if (rawBody.language !== undefined) updateData.language = rawBody.language;
    if (rawBody.prerequisites !== undefined) updateData.prerequisites = rawBody.prerequisites;
    if (rawBody.learningGoals !== undefined) updateData.learningGoals = rawBody.learningGoals;
    if (rawBody.instructor !== undefined) updateData.instructor = rawBody.instructor;
    if (rawBody.status !== undefined) updateData.status = rawBody.status;
    if (rawBody.published !== undefined) updateData.published = rawBody.published;
    if (rawBody.featured !== undefined) updateData.featured = rawBody.featured;
    if (rawBody.views !== undefined) updateData.views = rawBody.views;

    try {
      if (body.thumbnailTempPath) {
        updateData.img = await replaceStorageFile(
          existingCourse.img,
          body.thumbnailTempPath,
          buildCourseThumbnailPath(id, "thumbnail.jpg")
        );
      }
      if (body.trailerTempPath) {
        updateData.introVideoUrl = await replaceStorageFile(
          existingCourse.introVideoUrl,
          body.trailerTempPath,
          buildCourseTrailerPath(id, "trailer.mp4")
        );
      }
    } catch (mediaError) {
      console.error("[PATCH course] media error:", mediaError);
      if (body.thumbnailTempPath) await safeDeleteStoragePath(body.thumbnailTempPath);
      if (body.trailerTempPath) await safeDeleteStoragePath(body.trailerTempPath);
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true
          }
        },
        tags: { include: { tag: true } }
      }
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
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return notFoundResponse("Course", "Course not found");
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId: id },
      select: { thumbnail: true, videoUrl: true },
    });

    await prisma.course.delete({ where: { id } });

    await safeDeleteStoragePath(existingCourse.img);
    await safeDeleteStoragePath(existingCourse.introVideoUrl);
    for (const lesson of lessons) {
      await safeDeleteStoragePath(lesson.thumbnail);
      await safeDeleteStoragePath(lesson.videoUrl);
    }

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting course:", error);
    return errorResponse(
      "Error deleting course",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
