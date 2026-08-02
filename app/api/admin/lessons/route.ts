import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { getAllLessons, createLessonForCourse } from "@/lib/services/lesson-service";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  createdResponse,
  HttpStatus,
} from "@/lib/api-response";
import { LessonCreateSchema } from "@/lib/schemas/course-management-schema";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(_req);
    if (!adminAuth) {
      return errorResponse(
        "دسترسی غیرمجاز",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    const lessons = await getAllLessons();
    return successResponse(lessons, "کلاس‌ها با موفقیت دریافت شدند");
  } catch (error) {
    console.error("[GET /api/admin/lessons] error:", error);
    return errorResponse(
      "خطایی در دریافت کلاس‌ها رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse(
        "دسترسی غیرمجاز",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    const body = await req.json();
    const parsed = LessonCreateSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        "خطای اعتبارسنجی",
        ErrorCodes.VALIDATION_ERROR,
        Object.fromEntries(
          parsed.error.errors.map((e) => [String(e.path[0]), e.message])
        ),
        HttpStatus.BAD_REQUEST
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: parsed.data.courseId },
    });
    if (!course) {
      return errorResponse(
        "دوره یافت نشد",
        ErrorCodes.NOT_FOUND,
        undefined,
        HttpStatus.NOT_FOUND
      );
    }
    if (parsed.data.chapterId && !course.hasChapters) {
      return errorResponse(
        "این دوره از فصل پشتیبانی نمی‌کند",
        ErrorCodes.VALIDATION_ERROR,
        undefined,
        HttpStatus.BAD_REQUEST
      );
    }

    const lesson = await createLessonForCourse(parsed.data.courseId, parsed.data);
    return createdResponse(lesson, "کلاس با موفقیت ایجاد شد");
  } catch (error) {
    console.error("[POST /api/admin/lessons] error:", error);
    if (error instanceof Error && error.message === "POSITION_CONFLICT") {
      return errorResponse(
        "تضاد در ترتیب",
        ErrorCodes.CONFLICT,
        undefined,
        409
      );
    }
    return errorResponse(
      "خطایی در ایجاد کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
