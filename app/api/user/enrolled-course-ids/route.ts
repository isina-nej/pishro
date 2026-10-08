import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * دریافت لیست شناسه‌های دوره‌هایی که کاربر فعلی در آن‌ها ثبت‌نام کرده است
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return successResponse({ courseIds: [] });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      select: { courseId: true },
    });

    return successResponse({
      courseIds: enrollments.map((e) => e.courseId),
    });
  } catch (error) {
    console.error("[GET /api/user/enrolled-course-ids] error:", error);
    return successResponse({ courseIds: [] });
  }
}
