// @/app/api/admin/courses/[id]/chapters/reorder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

/**
 * POST /api/admin/courses/[id]/chapters/reorder
 * Reorder chapters by updating positions
 * Payload: { order: ["chapter-id-1", "chapter-id-2", ...] }
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

    // Verify all chapter IDs belong to this course
    const existingChapters = await prisma.chapter.findMany({
      where: { courseId },
      select: { id: true },
    });

    const existingIds = new Set(existingChapters.map((c) => c.id));
    const allValid = order.every((id: string) => existingIds.has(id));

    if (!allValid) {
      return errorResponse(
        "برخی از فصل‌ها معتبر نیستند",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // Update positions in transaction
    await prisma.$transaction(
      order.map((id: string, index: number) =>
        prisma.chapter.update({
          where: { id },
          data: { position: index },
        })
      )
    );

    return successResponse(
      { success: true },
      "ترتیب فصل‌ها با موفقیت به‌روز شد"
    );
  } catch (error) {
    console.error(
      "[POST /api/admin/courses/[id]/chapters/reorder] error:",
      error
    );

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return errorResponse(
        "تضاد در ترتیب فصل‌ها",
        ErrorCodes.CONFLICT,
        undefined,
        409
      );
    }

    return errorResponse(
      "خطا در بروزرسانی ترتیب",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
