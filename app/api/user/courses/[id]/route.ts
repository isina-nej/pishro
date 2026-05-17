import { auth } from "@/auth";
import {
  errorResponse,
  ErrorCodes,
  forbiddenResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { getPurchasedCourseForUser } from "@/lib/services/user-purchased-course";

/**
 * GET /api/user/courses/[id]
 * Course content for enrolled users (no video URLs).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const { id: courseId } = await params;
    const course = await getPurchasedCourseForUser(session.user.id, courseId);

    if (course === null) {
      const exists = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true },
      });
      if (!exists) {
        return notFoundResponse("Course", "دوره یافت نشد");
      }
      return forbiddenResponse("شما در این دوره ثبت‌نام نکرده‌اید");
    }

    return successResponse(course, "دوره با موفقیت دریافت شد");
  } catch (error) {
    console.error("[GET /api/user/courses/[id]] error:", error);
    return errorResponse(
      "خطایی در دریافت دوره رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
