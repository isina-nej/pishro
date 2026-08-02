import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { errorResponse, successResponse, ErrorCodes, notFoundResponse, validationError, HttpStatus } from "@/lib/api-response";
import { LessonUpdateSchema } from "@/lib/schemas/course-management-schema";
import { deleteLesson, updateLesson } from "@/lib/services/lesson-service";

export async function PATCH(
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
    const parsed = LessonUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors);
    }

    const lesson = await updateLesson(id, parsed.data);

    return successResponse(lesson, "درس ذخیره شد");
  } catch (error) {
    console.error("Error updating lesson:", error);
    if (error instanceof Error && error.message === "LESSON_NOT_FOUND") {
      return notFoundResponse("Lesson", "درس یافت نشد");
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Lesson", "درس یافت نشد");
    }
    return errorResponse("Error updating lesson", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(
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
    await deleteLesson(id);
    return successResponse({ ok: true }, "درس حذف شد");
  } catch (error) {
    console.error("Error deleting lesson:", error);
    if (error instanceof Error && error.message === "LESSON_NOT_FOUND") {
      return notFoundResponse("Lesson", "درس یافت نشد");
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Lesson", "درس یافت نشد");
    }
    return errorResponse("Error deleting lesson", ErrorCodes.DATABASE_ERROR);
  }
}
