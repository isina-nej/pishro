// @/app/api/courses/[courseId]/lessons/route.ts
import { NextRequest } from "next/server";
import { getLessonsByCourse } from "@/lib/services/lesson-service";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    courseId: string;
  }>;
}

/**
 * GET /api/courses/[courseId]/lessons
 * دریافت تمام کلاس‌های یک دوره
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { courseId } = await params;

    if (!courseId) {
      return errorResponse(
        "شناسه دوره مشخص نشده است",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const lessons = await getLessonsByCourse(courseId);

    return successResponse(lessons, "کلاس‌ها با موفقیت دریافت شدند");
  } catch (error) {
    console.error("[GET /api/courses/[courseId]/lessons] error:", error);
    return errorResponse(
      "خطایی در دریافت کلاس‌ها رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
