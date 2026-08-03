import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, ErrorCodes, validationError, HttpStatus } from "@/lib/api-response";
import { ReorderSchema } from "@/lib/schemas/course-management-schema";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!getAdminAuthFromHeaders(req.headers)) {
      return errorResponse(
        "Please login to continue",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }
    const { id } = await params;
    const body = await req.json();
    const parsed = ReorderSchema.safeParse(body);
    if (!parsed.success) {
      return validationError({ order: "ترتیب ارسال‌شده معتبر نیست" });
    }

    await prisma.$transaction(
      parsed.data.order.map((lessonId, order) =>
        prisma.lesson.update({
          where: { id: lessonId },
          data: { order, courseId: id },
        })
      )
    );

    return successResponse({ ok: true }, "ترتیب درس‌ها ذخیره شد");
  } catch (error) {
    console.error("Error reordering lessons:", error);
    return errorResponse("Error reordering lessons", ErrorCodes.DATABASE_ERROR);
  }
}
