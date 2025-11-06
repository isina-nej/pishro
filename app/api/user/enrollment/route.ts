// @/app/api/user/enrollment/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ✅ Update enrollment progress
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { enrollmentId, progress, completed } = await req.json();

    if (!enrollmentId) {
      return NextResponse.json(
        { error: "enrollmentId is required" },
        { status: 400 }
      );
    }

    // Verify enrollment belongs to user
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment || enrollment.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Enrollment not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress:
          progress !== undefined ? Math.min(Math.max(progress, 0), 100) : undefined,
        completedAt: completed ? new Date() : undefined,
        lastAccessAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    console.error("[PATCH /api/user/enrollment] error:", error);
    return NextResponse.json(
      { ok: false, error: "خطایی در بروزرسانی پیشرفت دوره رخ داد" },
      { status: 500 }
    );
  }
}
