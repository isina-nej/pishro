import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { ReorderSchema } from "@/lib/schemas/course-management-schema";
import { reorderLessons } from "@/lib/course-order";

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
    const body = await req.json();
    const parsed = ReorderSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("لیست ترتیب نامعتبر است", ErrorCodes.VALIDATION_ERROR);
    }

    const { order } = parsed.data;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return errorResponse("دوره یافت نشد", ErrorCodes.NOT_FOUND);
    }

    const existingLessons = await prisma.lesson.findMany({
      where: { courseId },
      select: { id: true },
    });

    if (
      order.length !== existingLessons.length ||
      !order.every((id) => existingLessons.some((l) => l.id === id))
    ) {
      return errorResponse(
        "برخی از درس‌ها معتبر نیستند",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    await reorderLessons(courseId, order);

    return successResponse({ success: true }, "ترتیب درس‌ها با موفقیت به‌روز شد");
  } catch (error) {
    console.error("[POST lessons/reorder] error:", error);
    if (error instanceof Error && error.message === "INVALID_LESSON_IDS") {
      return errorResponse(
        "برخی از درس‌ها معتبر نیستند",
        ErrorCodes.VALIDATION_ERROR
      );
    }
    return errorResponse("تضاد در ترتیب درس‌ها", ErrorCodes.CONFLICT, undefined, 409);
  }
}
