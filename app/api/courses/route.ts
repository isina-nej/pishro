import { query } from "@/lib/db";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

export async function GET() {
  try {
    const courses = await query(
      `SELECT * FROM Course ORDER BY createdAt DESC`
    );

    return successResponse(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return errorResponse(
      "خطایی در دریافت دوره‌ها رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
