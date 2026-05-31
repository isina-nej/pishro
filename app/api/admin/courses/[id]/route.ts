import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  successResponse,
  ErrorCodes,
  notFoundResponse,
  validationError,
} from "@/lib/api-response";
import { CourseUpdateSchema } from "@/lib/schemas/course-management-schema";
import { normalizeImageUrl } from "@/lib/utils";
import {
  buildCourseThumbnailPath,
  buildCourseTrailerPath,
  replaceStorageFile,
} from "@/lib/course-media";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, slug: true, title: true } },
        tags: { include: { tag: true } },
        chapters: {
          orderBy: { position: "asc" },
          include: { lessons: { orderBy: { order: "asc" } } },
        },
        lessons: { orderBy: { order: "asc" } },
        _count: {
          select: {
            comments: true,
            enrollments: true,
            orderItems: true,
            quizzes: true,
            lessons: true,
            chapters: true,
          },
        },
      },
    });

    if (!course) {
      return notFoundResponse("Course", "دوره یافت نشد");
    }

    return successResponse(course, "دوره با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching course:", error);
    return errorResponse("Error fetching course", ErrorCodes.DATABASE_ERROR);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const body = await req.json();
    const mapped = {
      ...body,
      title: body.title ?? body.subject,
      cost: body.cost ?? body.price,
      thumbnailPath: body.thumbnailPath ?? body.img,
      trailerVideoPath: body.trailerVideoPath ?? body.introVideoUrl,
    };

    const parsed = CourseUpdateSchema.safeParse(mapped);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors);
    }

    const data: Prisma.CourseUpdateInput = {};
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

    if (title !== undefined) data.subject = title;
    if (slug !== undefined) data.slug = slug || null;
    if (cost !== undefined) data.price = cost;
    if (description !== undefined) data.description = description || null;
    if (categoryId !== undefined) {
      data.category = categoryId ? { connect: { id: categoryId } } : { disconnect: true };
    }
    if (instructor !== undefined) data.instructor = instructor || null;
    if (level !== undefined) data.level = level;
    if (status !== undefined) data.status = status;
    if (published !== undefined) data.published = published;
    if (featured !== undefined) data.featured = featured;
    if (likes !== undefined) data.likes = likes;
    if (dislikes !== undefined) data.dislikes = dislikes;
    if (hasChapters !== undefined) data.hasChapters = hasChapters;
    const existing =
      thumbnailTempPath || trailerTempPath
        ? await prisma.course.findUnique({
            where: { id },
            select: { img: true, introVideoUrl: true },
          })
        : null;

    if ((thumbnailTempPath || trailerTempPath) && !existing) {
      return notFoundResponse("Course", "دوره یافت نشد");
    }

    if (thumbnailTempPath) {
      data.img = await replaceStorageFile(
        existing?.img,
        thumbnailTempPath,
        buildCourseThumbnailPath(id, thumbnailTempPath)
      );
    } else if (thumbnailPath !== undefined) {
      data.img = normalizeImageUrl(thumbnailPath);
    }

    if (trailerTempPath) {
      data.introVideoUrl = await replaceStorageFile(
        existing?.introVideoUrl,
        trailerTempPath,
        buildCourseTrailerPath(id, trailerTempPath)
      );
    } else if (trailerVideoPath !== undefined) {
      data.introVideoUrl = normalizeImageUrl(trailerVideoPath);
    }

    const course = await prisma.course.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, slug: true, title: true } },
        tags: { include: { tag: true } },
      },
    });

    return successResponse(course, "دوره با موفقیت ذخیره شد");
  } catch (error) {
    console.error("Error updating course:", error);
    if (error instanceof Error && error.message === "مسیر فایل موقت نامعتبر است") {
      return validationError({ media: "فایل موقت معتبر نیست یا قبلاً منتقل شده است" });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Course", "دوره یافت نشد");
    }
    return errorResponse("Error updating course", ErrorCodes.DATABASE_ERROR);
  }
}
