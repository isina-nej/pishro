// @/app/api/lessons/[lessonId]/route.ts
import { NextRequest } from "next/server";
import {
  getLessonById,
  incrementLessonViews,
} from "@/lib/services/lesson-service";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  ErrorCodes,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    lessonId: string;
  }>;
}

/**
 * GET /api/lessons/[lessonId]
 * دریافت جزئیات یک کلاس
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { lessonId } = await params;

    if (!lessonId) {
      return errorResponse(
        "شناسه کلاس مشخص نشده است",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const lesson = await getLessonById(lessonId);

    if (!lesson) {
      return notFoundResponse("کلاس مورد نظر یافت نشد");
    }

    // افزایش تعداد بازدید
    await incrementLessonViews(lessonId);

    return successResponse(lesson, "کلاس با موفقیت دریافت شد");
  } catch (error) {
    console.error("[GET /api/lessons/[lessonId]] error:", error);
    return errorResponse(
      "خطایی در دریافت کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
