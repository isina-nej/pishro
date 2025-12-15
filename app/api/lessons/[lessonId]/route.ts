// @/app/api/lessons/[lessonId]/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getLessonById,
  incrementLessonViews,
  checkUserAccessToLesson,
} from "@/lib/services/lesson-service";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
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
 * برای دسترسی به ویدیو، کاربر باید در دوره ثبت‌نام کرده باشد
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

    // بررسی احراز هویت کاربر
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse("برای دسترسی به ویدیو باید وارد شوید");
    }

    // بررسی دسترسی کاربر به این درس
    const hasAccess = await checkUserAccessToLesson(session.user.id, lessonId);

    if (!hasAccess) {
      // کاربر دسترسی ندارد
      return forbiddenResponse(
        "شما برای مشاهده این ویدیو باید ابتدا دوره را خریداری کنید"
      );
    }

    // افزایش تعداد بازدید فقط برای کاربرانی که دسترسی دارند
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
