// @/app/api/admin/chapters/[id]/route.ts
import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

/**
 * PATCH /api/admin/chapters/[id]
 * Update a chapter
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const { title } = await req.json();

    // Validation
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return errorResponse(
          "عنوان فصل الزامی است",
          ErrorCodes.VALIDATION_ERROR
        );
      }

      if (title.length > 200) {
        return errorResponse(
          "عنوان فصل نباید بیشتر از 200 کاراکتر باشد",
          ErrorCodes.VALIDATION_ERROR
        );
      }
    }

    // Verify chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      return errorResponse("فصل یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Update chapter
    const updated = await prisma.chapter.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
      },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
    });

    return successResponse(updated, "فصل با موفقیت به‌روز شد");
  } catch (error) {
    console.error("[PATCH /api/admin/chapters/[id]] error:", error);
    return errorResponse("خطا در بروزرسانی فصل", ErrorCodes.DATABASE_ERROR);
  }
}

/**
 * DELETE /api/admin/chapters/[id]
 * Delete a chapter and move its lessons to course level
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    // Verify chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      return errorResponse("فصل یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Move lessons to course level (set chapterId to null)
    await prisma.lesson.updateMany({
      where: { chapterId: id },
      data: { chapterId: null },
    });

    // Delete chapter
    await prisma.chapter.delete({
      where: { id },
    });

    return successResponse(
      { success: true },
      "فصل با موفقیت حذف شد و درس‌های آن به سطح دوره منتقل شدند"
    );
  } catch (error) {
    console.error("[DELETE /api/admin/chapters/[id]] error:", error);
    return errorResponse("خطا در حذف فصل", ErrorCodes.DATABASE_ERROR);
  }
}
