// @/app/api/admin/courses/[id]/lessons/reorder/route.ts
import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

/**
 * POST /api/admin/courses/[id]/lessons/reorder
 * Reorder lessons by updating positions within a course
 * Payload: { order: ["lesson-id-1", "lesson-id-2", ...] }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const { id: courseId } = await params;
    const { order } = await req.json();

    // Validation
    if (!Array.isArray(order) || order.length === 0) {
      return errorResponse(
        "لیست ترتیب نامعتبر است",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return errorResponse("دوره یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Verify all lesson IDs belong to this course
    const existingLessons = await prisma.lesson.findMany({
      where: { courseId },
      select: { id: true },
    });

    const existingIds = new Set(existingLessons.map((l) => l.id));
    const allValid = order.every((id: string) => existingIds.has(id));

    if (!allValid) {
      return errorResponse(
        "برخی از درس‌ها معتبر نیستند",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // Update positions in transaction
    await prisma.$transaction(
      order.map((id: string, index: number) =>
        prisma.lesson.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return successResponse(
      { success: true },
      "ترتیب درس‌ها با موفقیت به‌روز شد"
    );
  } catch (error) {
    console.error(
      "[POST /api/admin/courses/[id]/lessons/reorder] error:",
      error
    );

    return errorResponse(
      "خطا در بروزرسانی ترتیب",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
