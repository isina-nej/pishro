// @/app/api/courses/[courseId]/lessons/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getLessonsByCourse } from "@/lib/services/lesson-service";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    courseId: string;
  }>;
}

/**
 * GET /api/courses/[courseId]/lessons
 * دریافت تمام کلاس‌های یک دوره
 * اگر کاربر دوره را خریده باشد، لینک ویدیو نمایش داده می‌شود
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

    // بررسی احراز هویت کاربر
    const session = await auth();

    // اگر کاربر وارد نشده یا دسترسی نداره، لینک ویدیو رو حذف می‌کنیم
    if (!session?.user?.id) {
      // کاربر وارد نشده - لیست درس‌ها بدون لینک ویدیو
      const lessonsWithoutVideo = lessons.map(
        ({ videoUrl: _videoUrl, ...lesson }) => ({
          ...lesson,
          hasAccess: false,
        })
      );
      return successResponse(
        lessonsWithoutVideo,
        "کلاس‌ها با موفقیت دریافت شدند"
      );
    }

    // بررسی دسترسی کاربر به این دوره
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      // کاربر دسترسی ندارد - لیست درس‌ها بدون لینک ویدیو
      const lessonsWithoutVideo = lessons.map(
        ({ videoUrl: _videoUrl, ...lesson }) => ({
          ...lesson,
          hasAccess: false,
        })
      );
      return successResponse(
        lessonsWithoutVideo,
        "کلاس‌ها با موفقیت دریافت شدند"
      );
    }

    // کاربر دسترسی دارد - همه اطلاعات شامل لینک ویدیو
    const lessonsWithAccess = lessons.map((lesson) => ({
      ...lesson,
      hasAccess: true,
    }));
    return successResponse(lessonsWithAccess, "کلاس‌ها با موفقیت دریافت شدند");
  } catch (error) {
    console.error("[GET /api/courses/[courseId]/lessons] error:", error);
    return errorResponse(
      "خطایی در دریافت کلاس‌ها رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
