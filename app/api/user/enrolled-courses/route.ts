// @/app/api/user/enrolled-courses/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  paginatedResponse,
  unauthorizedResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

// ✅ Get user's enrolled courses with progress
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: {
          course: {
            select: {
              id: true,
              subject: true,
              img: true,
              price: true,
              discountPercent: true,
              time: true,
              rating: true,
              videosCount: true,
              description: true,
              lessons: {
                where: { published: true },
                orderBy: { order: "asc" },
                take: 1,
                select: {
                  id: true,
                },
              },
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.enrollment.count({
        where: { userId: session.user.id },
      }),
    ]);

    const formattedEnrollments = enrollments.map((enrollment) => ({
      id: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      progress: enrollment.progress,
      completedAt: enrollment.completedAt,
      lastAccessAt: enrollment.lastAccessAt,
      isCompleted: enrollment.progress === 100,
      course: enrollment.course,
    }));

    return paginatedResponse(formattedEnrollments, page, limit, total);
  } catch (error) {
    console.error("[GET /api/user/enrolled-courses] error:", error);
    return errorResponse(
      "خطایی در دریافت دوره‌های ثبت‌نامی رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
