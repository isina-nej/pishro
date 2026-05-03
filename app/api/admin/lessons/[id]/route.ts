// @/app/api/admin/lessons/[id]/route.ts
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import {
  getLessonById,
  updateLesson,
  deleteLesson,
} from "@/lib/services/lesson-service";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  ErrorCodes,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/lessons/[id]
 * دریافت یک کلاس (برای ادمین)
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز");
    }

    const { id } = await params;
    const lesson = await getLessonById(id);

    if (!lesson) {
      return notFoundResponse("کلاس مورد نظر یافت نشد");
    }

    return successResponse(lesson, "کلاس با موفقیت دریافت شد");
  } catch (error) {
    console.error("[GET /api/admin/lessons/[id]] error:", error);
    return errorResponse(
      "خطایی در دریافت کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * PATCH /api/admin/lessons/[id]
 * به‌روزرسانی یک کلاس (برای ادمین)
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز");
    }

    const { id } = await params;
    const body = await req.json();

    const lesson = await updateLesson(id, body);

    return successResponse(lesson, "کلاس با موفقیت به‌روزرسانی شد");
  } catch (error) {
    console.error("[PATCH /api/admin/lessons/[id]] error:", error);
    return errorResponse(
      "خطایی در به‌روزرسانی کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * DELETE /api/admin/lessons/[id]
 * حذف یک کلاس (برای ادمین)
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز");
    }

    const { id } = await params;

    await deleteLesson(id);

    return successResponse(null, "کلاس با موفقیت حذف شد");
  } catch (error) {
    console.error("[DELETE /api/admin/lessons/[id]] error:", error);
    return errorResponse(
      "خطایی در حذف کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
