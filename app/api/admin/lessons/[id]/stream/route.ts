import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import { errorResponse, ErrorCodes } from "@/lib/api-response";
import { resolveLessonVideoRelativePath } from "@/lib/services/lesson-service";
import { streamLessonVideoByRelativePath } from "@/lib/stream-lesson-video";

/**
 * GET /api/admin/lessons/[id]/stream
 * Proxied stream — storage URL never sent to client
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const { id: lessonId } = await params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        video: { select: { originalPath: true, fileFormat: true } },
      },
    });

    if (!lesson) {
      return errorResponse("درس یافت نشد", ErrorCodes.NOT_FOUND);
    }

    const relativePath = resolveLessonVideoRelativePath(lesson);
    if (!relativePath) {
      return errorResponse(
        "ویدیویی برای این درس یافت نشد",
        ErrorCodes.NOT_FOUND
      );
    }

    return await streamLessonVideoByRelativePath(relativePath);
  } catch (error) {
    console.error("[GET /api/admin/lessons/[id]/stream] error:", error);
    return errorResponse(
      "خطا در پخش ویدیو",
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      500
    );
  }
}
