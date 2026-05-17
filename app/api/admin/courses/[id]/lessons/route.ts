import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { LessonCreateSchema } from "@/lib/schemas/course-management-schema";
import { createLessonForCourse } from "@/lib/services/lesson-service";

/**
 * GET /api/admin/courses/[id]/lessons
 * POST /api/admin/courses/[id]/lessons
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id: courseId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;
    const chapterId = searchParams.get("chapterId");

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return errorResponse("دوره یافت نشد", ErrorCodes.NOT_FOUND);
    }

    const where = {
      courseId,
      ...(chapterId ? { chapterId } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.lesson.findMany({
        where,
        orderBy: { order: "asc" },
        skip,
        take: limit,
      }),
      prisma.lesson.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("[GET /api/admin/courses/[id]/lessons] error:", error);
    return errorResponse("خطا در دریافت درس‌ها", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id: courseId } = await params;
    const body = await req.json();
    const parsed = LessonCreateSchema.safeParse({ ...body, courseId });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        if (e.path[0]) fieldErrors[String(e.path[0])] = e.message;
      });
      return errorResponse(
        "خطای اعتبارسنجی",
        ErrorCodes.VALIDATION_ERROR,
        fieldErrors
      );
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return errorResponse("دوره یافت نشد", ErrorCodes.NOT_FOUND);
    }

    if (parsed.data.chapterId && !course.hasChapters) {
      return errorResponse(
        "این دوره از فصل پشتیبانی نمی‌کند",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const lesson = await createLessonForCourse(courseId, parsed.data);
    return createdResponse(lesson, "درس با موفقیت ایجاد شد");
  } catch (error) {
    console.error("[POST /api/admin/courses/[id]/lessons] error:", error);
    if (error instanceof Error && error.message === "POSITION_CONFLICT") {
      return errorResponse("تضاد در ترتیب درس‌ها", ErrorCodes.CONFLICT, undefined, 409);
    }
    return errorResponse("خطا در ایجاد درس", ErrorCodes.DATABASE_ERROR);
  }
}
