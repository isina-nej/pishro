/**
 * Admin Courses Management API
 * GET /api/admin/courses - List all courses with pagination and filters
 * POST /api/admin/courses - Create a new course
 * 
 * Authentication: JWT Bearer token from admin login
 */

import { NextRequest } from "next/server";
import { verifyAdminAccessToken } from "@/lib/admin-auth";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  validationError
} from "@/lib/api-response";
import { normalizeImageUrl } from "@/lib/utils";
import { CourseCreateSchema } from "@/lib/schemas/course-management-schema";
import {
  buildCourseThumbnailPath,
  buildCourseTrailerPath,
  commitTempMediaPath,
  safeDeleteStoragePath,
} from "@/lib/course-media";

// Helper to get admin auth from request
function getAdminUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.slice(7);
  return verifyAdminAccessToken(token);
}

function slugifyCourseTitle(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

async function createUniqueCourseSlug(title: string, requestedSlug?: string | null) {
  const base = slugifyCourseTitle(requestedSlug || title) || `course-${Date.now()}`;
  let slug = base;
  let suffix = 2;

  while (await prisma.course.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function GET(req: NextRequest) {
  try {
    // Admin authentication via JWT token
    const adminUser = getAdminUserFromRequest(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const published = searchParams.get("published");
    const featured = searchParams.get("featured");
    const status = searchParams.get("status");
    const level = searchParams.get("level");

    // Build where clause
    const where: Prisma.CourseWhereInput = {};

    if (search) {
      where.OR = [
        { subject: { contains: search } },
        { description: { contains: search } },
        { slug: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    if (featured === "true") {
      where.featured = true;
    } else if (featured === "false") {
      where.featured = false;
    }

    if (status && (status === "ACTIVE" || status === "COMING_SOON" || status === "ARCHIVED")) {
      where.status = status as Prisma.EnumCourseStatusFilter;
    }

    if (level && (level === "BEGINNER" || level === "INTERMEDIATE" || level === "ADVANCED")) {
      where.level = level as Prisma.EnumCourseLevelNullableFilter;
    }

    // Fetch courses
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: {
            select: {
              id: true,
              slug: true,
              title: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  slug: true,
                  title: true
                }
              }
            }
          },
          _count: {
            select: {
              comments: true,
              enrollments: true,
              orderItems: true,
              quizzes: true
            }
          }
        }
      }),
      prisma.course.count({ where }),
    ]);

    return paginatedResponse(courses, page, limit, total);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return errorResponse(
      "Error fetching courses",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Admin authentication via JWT token
    const adminUser = getAdminUserFromRequest(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const body = await req.json();
    
    // Map field names to schema expectations and normalize
    const mapped = {
      ...body,
      title: body.title ?? body.subject,
      cost: body.cost ?? body.price,
      thumbnailPath: body.thumbnailPath ?? body.img,
      trailerVideoPath: body.trailerVideoPath ?? body.introVideoUrl,
    };

    // Validate against schema
    const parsed = CourseCreateSchema.safeParse(mapped);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach(err => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return validationError(errors);
    }

    const {
      title,
      slug,
      cost,
      description,
      categoryId,
      instructor,
      level,
      status,
      published,
      featured,
      likes,
      dislikes,
      hasChapters,
      thumbnailPath,
      trailerVideoPath,
      thumbnailTempPath,
      trailerTempPath,
    } = parsed.data;

    // Normalize image paths
    const normalizedThumbnail = thumbnailTempPath ? undefined : normalizeImageUrl(thumbnailPath);
    const normalizedTrailer = trailerTempPath ? undefined : normalizeImageUrl(trailerVideoPath);
    const courseSlug = await createUniqueCourseSlug(title, slug);

    // Create course with validated data
    const course = await prisma.course.create({
      data: {
        subject: title,
        slug: courseSlug,
        price: cost,
        description,
        categoryId: categoryId || null,
        instructor: instructor || null,
        level: level || null,
        likes: likes ?? 0,
        dislikes: dislikes ?? 0,
        hasChapters: hasChapters ?? false,
        img: normalizedThumbnail,
        introVideoUrl: normalizedTrailer,
        language: "FA",
        status: status ?? "ACTIVE",
        published: published ?? true,
        featured: featured ?? false,
        prerequisites: [],
        learningGoals: [],
      },
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

    const mediaUpdate: Prisma.CourseUpdateInput = {};

    try {
      if (thumbnailTempPath) {
        mediaUpdate.img = await commitTempMediaPath(
          thumbnailTempPath,
          buildCourseThumbnailPath(course.id, thumbnailTempPath)
        );
      }

      if (trailerTempPath) {
        mediaUpdate.introVideoUrl = await commitTempMediaPath(
          trailerTempPath,
          buildCourseTrailerPath(course.id, trailerTempPath)
        );
      }

      if (Object.keys(mediaUpdate).length > 0) {
        const updatedCourse = await prisma.course.update({
          where: { id: course.id },
          data: mediaUpdate,
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

        return createdResponse(updatedCourse, "Course created successfully");
      }
    } catch (mediaError) {
      if (thumbnailTempPath) await safeDeleteStoragePath(thumbnailTempPath);
      if (trailerTempPath) await safeDeleteStoragePath(trailerTempPath);
      if (typeof mediaUpdate.img === "string") await safeDeleteStoragePath(mediaUpdate.img);
      if (typeof mediaUpdate.introVideoUrl === "string") {
        await safeDeleteStoragePath(mediaUpdate.introVideoUrl);
      }
      await prisma.course.delete({ where: { id: course.id } }).catch(() => undefined);
      throw mediaError;
    }

    return createdResponse(course, "Course created successfully");
  } catch (error) {
    console.error("Error creating course:", error);
    return errorResponse(
      "Error creating course",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
