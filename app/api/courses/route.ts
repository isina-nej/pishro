import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });

    return successResponse(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return errorResponse(
      "خطایی در دریافت دوره‌ها رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
