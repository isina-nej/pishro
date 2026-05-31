import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { createdResponse, errorResponse, paginatedResponse, ErrorCodes, validationError } from "@/lib/api-response";
import { LessonCreateSchema } from "@/lib/schemas/course-management-schema";
import { createLessonForCourse } from "@/lib/services/lesson-service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!getAdminAuthFromHeaders(req.headers)) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    const { id } = await params;
    const lessons = await prisma.lesson.findMany({
      where: { courseId: id },
      orderBy: { order: "asc" },
    });
    return paginatedResponse(lessons, 1, lessons.length || 1, lessons.length);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return errorResponse("Error fetching lessons", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!getAdminAuthFromHeaders(req.headers)) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    const { id } = await params;
    const body = await req.json();
    const parsed = LessonCreateSchema.safeParse({ ...body, courseId: id });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors);
    }

    const lesson = await createLessonForCourse(id, parsed.data);

    return createdResponse(lesson, "درس با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating lesson:", error);
    return errorResponse("Error creating lesson", ErrorCodes.DATABASE_ERROR);
  }
}
