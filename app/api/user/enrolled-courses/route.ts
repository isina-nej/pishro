// @/app/api/user/enrolled-courses/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ✅ Get user's enrolled courses with progress
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    return NextResponse.json({
      ok: true,
      enrollments: formattedEnrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/user/enrolled-courses] error:", error);
    return NextResponse.json(
      { ok: false, error: "خطایی در دریافت دوره‌های ثبت‌نامی رخ داد" },
      { status: 500 }
    );
  }
}
