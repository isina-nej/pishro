import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  getLessonById,
  updateLesson,
  deleteLesson,
} from "@/lib/services/lesson-service";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { LessonUpdateSchema } from "@/lib/schemas/course-management-schema";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const lesson = await getLessonById(id);

    if (!lesson) {
      return notFoundResponse("کلاس مورد نظر یافت نشد");
    }

    return successResponse(lesson, "کلاس با موفقیت دریافت شد");
  } catch (error) {
    console.error("[GET /api/admin/lessons/[id]] error:", error);
    return errorResponse(
      "خطایی در دریافت کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = LessonUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        "خطای اعتبارسنجی",
        ErrorCodes.VALIDATION_ERROR,
        Object.fromEntries(
          parsed.error.errors.map((e) => [String(e.path[0]), e.message])
        )
      );
    }

    const existing = await prisma.lesson.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("کلاس مورد نظر یافت نشد");
    }

    if (parsed.data.chapterId && existing.courseId) {
      const course = await prisma.course.findUnique({
        where: { id: existing.courseId },
      });
      if (course && !course.hasChapters) {
        return errorResponse(
          "این دوره از فصل پشتیبانی نمی‌کند",
          ErrorCodes.VALIDATION_ERROR
        );
      }
    }

    const lesson = await updateLesson(id, parsed.data);
    return successResponse(lesson, "کلاس با موفقیت به‌روزرسانی شد");
  } catch (error) {
    console.error("[PATCH /api/admin/lessons/[id]] error:", error);
    if (error instanceof Error && error.message === "POSITION_CONFLICT") {
      return errorResponse("تضاد در ترتیب", ErrorCodes.CONFLICT, undefined, 409);
    }
    return errorResponse(
      "خطایی در به‌روزرسانی کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    await deleteLesson(id);
    return successResponse(null, "کلاس با موفقیت حذف شد");
  } catch (error) {
    console.error("[DELETE /api/admin/lessons/[id]] error:", error);
    return errorResponse(
      "خطایی در حذف کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
