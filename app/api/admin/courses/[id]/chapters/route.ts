import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { createdResponse, errorResponse, paginatedResponse, ErrorCodes, validationError, HttpStatus } from "@/lib/api-response";
import { ChapterCreateSchema } from "@/lib/schemas/course-management-schema";

export async function GET(
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
    const chapters = await prisma.chapter.findMany({
      where: { courseId: id },
      orderBy: { position: "asc" },
      include: { lessons: { select: { id: true, title: true, order: true } } },
    });
    return paginatedResponse(chapters, 1, chapters.length || 1, chapters.length);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return errorResponse("Error fetching chapters", ErrorCodes.DATABASE_ERROR);
  }
}

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
    const parsed = ChapterCreateSchema.safeParse(body);
    if (!parsed.success) {
      return validationError({ title: parsed.error.errors[0]?.message || "عنوان نامعتبر است" });
    }

    const lastChapter = await prisma.chapter.findFirst({
      where: { courseId: id },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const chapter = await prisma.chapter.create({
      data: {
        courseId: id,
        title: parsed.data.title,
        position: (lastChapter?.position ?? -1) + 1,
      },
    });

    await prisma.course.update({ where: { id }, data: { hasChapters: true } });
    return createdResponse(chapter, "فصل با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating chapter:", error);
    return errorResponse("Error creating chapter", ErrorCodes.DATABASE_ERROR);
  }
}
