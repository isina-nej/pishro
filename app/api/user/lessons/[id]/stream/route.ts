import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  ErrorCodes,
  forbiddenResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/lib/api-response";
import { resolveLessonVideoRelativePath } from "@/lib/services/lesson-service";
import { streamLessonVideoByRelativePath } from "@/lib/stream-lesson-video";
import { userHasEnrollment } from "@/lib/services/user-purchased-course";

/**
 * GET /api/user/lessons/[id]/stream
 * Proxied lesson video for enrolled users.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const { id: lessonId } = await params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        video: { select: { originalPath: true, fileFormat: true } },
      },
    });

    if (!lesson || !lesson.published) {
      return notFoundResponse("Lesson", "درس یافت نشد");
    }

    const enrolled = await userHasEnrollment(session.user.id, lesson.courseId);
    if (!enrolled) {
      return forbiddenResponse("شما به این درس دسترسی ندارید");
    }

    const relativePath = resolveLessonVideoRelativePath(lesson);
    if (!relativePath) {
      return notFoundResponse("Lesson", "ویدیویی برای این درس یافت نشد");
    }

    return await streamLessonVideoByRelativePath(relativePath);
  } catch (error) {
    console.error("[GET /api/user/lessons/[id]/stream] error:", error);
    return errorResponse(
      "خطا در پخش ویدیو",
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      500
    );
  }
}
