// @/app/api/video/token/route.ts
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  validationError,
  ErrorCodes,
} from "@/lib/api-response";
import { generateStreamToken } from "@/lib/services/video-token-service";
import { getVideoByVideoId } from "@/lib/services/video-service";
import { checkUserAccessToLesson } from "@/lib/services/lesson-service";
import type { RequestStreamTokenInput } from "@/types/video";

/**
 * POST /api/video/token
 * دریافت توکن برای پخش ویدیو
 * این API قبل از پخش ویدیو فراخوانی می‌شود و یک توکن کوتاه‌مدت تولید می‌کند
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("برای پخش ویدیو باید وارد شوید");
    }

    const body: RequestStreamTokenInput = await req.json();
    const { videoId } = body;

    // Validation
    if (!videoId) {
      return validationError({
        videoId: "شناسه ویدیو الزامی است",
      });
    }

    // بررسی وجود ویدیو
    const video = await getVideoByVideoId(videoId);

    if (!video) {
      return notFoundResponse("ویدیو", "ویدیو یافت نشد");
    }

    // بررسی اینکه ویدیو آماده پخش است
    if (video.processingStatus !== "READY") {
      return errorResponse(
        "ویدیو هنوز آماده پخش نیست",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // بررسی دسترسی کاربر به ویدیو
    // اگر ویدیو به یک درس متصل باشد، باید کاربر در دوره آن درس ثبت‌نام کرده باشد
    const lessons = await import("@/lib/services/lesson-service").then((m) =>
      m.getLessonsByCourse
    );

    // پیدا کردن درس‌هایی که این ویدیو دارند
    const { prisma } = await import("@/lib/prisma");
    const lessonsWithVideo = await prisma.lesson.findMany({
      where: { videoId: video.id },
      select: { id: true, courseId: true },
    });

    // بررسی دسترسی کاربر به حداقل یکی از درس‌ها
    if (lessonsWithVideo.length > 0) {
      const hasAccess = await Promise.any(
        lessonsWithVideo.map((lesson) =>
          checkUserAccessToLesson(session.user.id!, lesson.id)
        )
      ).catch(() => false);

      if (!hasAccess && session.user.role !== "ADMIN") {
        return unauthorizedResponse(
          "شما به این ویدیو دسترسی ندارید. لطفاً ابتدا در دوره مربوطه ثبت‌نام کنید."
        );
      }
    }

    // تولید توکن (30 ثانیه اعتبار)
    const tokenData = generateStreamToken(
      videoId,
      session.user.id,
      30 // 30 ثانیه
    );

    return successResponse(
      {
        token: tokenData.token,
        expiresAt: tokenData.expiresAt,
        videoId: tokenData.videoId,
      },
      "توکن با موفقیت ایجاد شد"
    );
  } catch (error) {
    console.error("[POST /api/video/token] error:", error);
    return errorResponse(
      "خطایی در ایجاد توکن رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
