import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { ReorderSchema } from "@/lib/schemas/course-management-schema";
import { reorderChapters } from "@/lib/course-order";

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

    const existingChapters = await prisma.chapter.findMany({
      where: { courseId },
      select: { id: true },
    });

    if (
      order.length !== existingChapters.length ||
      !order.every((id) => existingChapters.some((c) => c.id === id))
    ) {
      return errorResponse(
        "برخی از فصل‌ها معتبر نیستند",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    await reorderChapters(courseId, order);

    return successResponse({ success: true }, "ترتیب فصل‌ها با موفقیت به‌روز شد");
  } catch (error) {
    console.error("[POST chapters/reorder] error:", error);
    return errorResponse("تضاد در ترتیب فصل‌ها", ErrorCodes.CONFLICT, undefined, 409);
  }
}
