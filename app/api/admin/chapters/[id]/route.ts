import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, ErrorCodes, notFoundResponse, validationError } from "@/lib/api-response";
import { ChapterUpdateSchema } from "@/lib/schemas/course-management-schema";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!getAdminAuthFromHeaders(req.headers)) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    const { id } = await params;
    const body = await req.json();
    const parsed = ChapterUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return validationError({ title: parsed.error.errors[0]?.message || "عنوان نامعتبر است" });
    }
    const chapter = await prisma.chapter.update({ where: { id }, data: parsed.data });
    return successResponse(chapter, "فصل ذخیره شد");
  } catch (error) {
    console.error("Error updating chapter:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Chapter", "فصل یافت نشد");
    }
    return errorResponse("Error updating chapter", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!getAdminAuthFromHeaders(req.headers)) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    const { id } = await params;
    await prisma.chapter.delete({ where: { id } });
    return successResponse({ ok: true }, "فصل حذف شد");
  } catch (error) {
    console.error("Error deleting chapter:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Chapter", "فصل یافت نشد");
    }
    return errorResponse("Error deleting chapter", ErrorCodes.DATABASE_ERROR);
  }
}
