// @/app/api/admin/courses/[id]/chapters/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  createdResponse,
  ErrorCodes,
  paginatedResponse,
} from "@/lib/api-response";

/**
 * GET /api/admin/courses/[id]/chapters
 * List chapters for a course with lessons
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const { id: courseId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return errorResponse("دوره یافت نشد", ErrorCodes.NOT_FOUND);
    }

    const [chapters, total] = await Promise.all([
      prisma.chapter.findMany({
        where: { courseId },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              videoId: true,
              thumbnail: true,
              duration: true,
              order: true,
              published: true,
              views: true,
            },
          },
        },
        orderBy: { position: "asc" },
        skip,
        take: limit,
      }),
      prisma.chapter.count({ where: { courseId } }),
    ]);

    return paginatedResponse(chapters, page, limit, total);
  } catch (error) {
    console.error("[GET /api/admin/courses/[id]/chapters] error:", error);
    return errorResponse(
      "خطا در دریافت فصل‌ها",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * POST /api/admin/courses/[id]/chapters
 * Create a new chapter
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const { id: courseId } = await params;
    const { title } = await req.json();

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return errorResponse("عنوان فصل الزامی است", ErrorCodes.VALIDATION_ERROR);
    }

    if (title.length > 200) {
      return errorResponse(
        "عنوان فصل نباید بیشتر از 200 کاراکتر باشد",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return errorResponse("دوره یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Get max position
    const maxPositionResult = await prisma.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const nextPosition = (maxPositionResult?.position ?? -1) + 1;

    // Create chapter
    const chapter = await prisma.chapter.create({
      data: {
        courseId,
        title: title.trim(),
        position: nextPosition,
      },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
    });

    return createdResponse(chapter, "فصل با موفقیت ایجاد شد");
  } catch (error) {
    console.error("[POST /api/admin/courses/[id]/chapters] error:", error);
    return errorResponse(
      "خطا در ایجاد فصل",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
