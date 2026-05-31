import { auth } from "@/auth";
import {
  checkUserAccessToLesson,
  resolveLessonVideoRelativePath,
} from "@/lib/services/lesson-service";
import { prisma } from "@/lib/prisma";
import { streamLessonVideoByRelativePath } from "@/lib/stream-lesson-video";
import {
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  ErrorCodes,
} from "@/lib/api-response";

interface LessonStreamRouteProps {
  params: Promise<{ lessonId: string }>;
}

export async function GET(req: Request, { params }: LessonStreamRouteProps) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const { lessonId } = await params;
    const hasAccess = await checkUserAccessToLesson(session.user.id, lessonId);
    if (!hasAccess) {
      return unauthorizedResponse("شما به این درس دسترسی ندارید");
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        videoUrl: true,
        video: {
          select: {
            originalPath: true,
          },
        },
      },
    });

    if (!lesson) {
      return notFoundResponse("Lesson", "درس یافت نشد");
    }

    const relativePath = resolveLessonVideoRelativePath(lesson);
    if (!relativePath) {
      return notFoundResponse("Video", "ویدیوی این درس یافت نشد");
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: { views: { increment: 1 } },
    });

    return await streamLessonVideoByRelativePath(relativePath, req);
  } catch (error) {
    console.error("[GET /api/user/lessons/[lessonId]/stream] error:", error);
    return errorResponse(
      "خطایی در پخش ویدیو رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
