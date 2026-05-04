// @/app/api/admin/lessons/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getAllLessons, createLesson } from "@/lib/services/lesson-service";
import {
  successResponse,
  errorResponse,
  ErrorCodes
} from "@/lib/api-response";

/**
 * GET /api/admin/lessons
 * دریافت تمام کلاس‌ها (برای ادمین)
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }
    const lessons = await getAllLessons();
    return successResponse(lessons, "کلاس‌ها با موفقیت دریافت شدند");
  } catch (error) {
    console.error("[GET /api/admin/lessons] error:", error);
    return errorResponse(
      "خطایی در دریافت کلاس‌ها رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
 * POST /api/admin/lessons
 * ایجاد کلاس جدید (برای ادمین)
export async function POST(req: NextRequest) {
    const body = await req.json();
    const {
      courseId,
      title,
      description,
      videoUrl,
      thumbnail,
      duration,
      order,
      published
    } = body;
    // Validation
    if (!courseId || !title || !videoUrl) {
      return errorResponse(
        "شناسه دوره، عنوان و آدرس ویدیو الزامی است",
        ErrorCodes.VALIDATION_ERROR
      );
    const lesson = await createLesson({
    });
    return successResponse(lesson, "کلاس با موفقیت ایجاد شد");
    console.error("[POST /api/admin/lessons] error:", error);
      "خطایی در ایجاد کلاس رخ داد",
