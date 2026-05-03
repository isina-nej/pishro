import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { query } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return errorResponse(
        "شناسه دوره الزامی است",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // In production, get actual user ID from session
    // For testing: use hardcoded test user ID
    const userId = "test-user-1";

    // Check if already saved
    const existing = await query(
      `SELECT id FROM CourseSave WHERE userId = ? AND courseId = ? LIMIT 1`,
      [userId, courseId]
    );

    if (existing.length > 0) {
      // Remove save
      await query(`DELETE FROM CourseSave WHERE id = ?`, [existing[0].id]);
      return successResponse({ saved: false });
    } else {
      // Add save
      const id = randomUUID();
      await query(
        `INSERT INTO CourseSave (id, userId, courseId) VALUES (?, ?, ?)`,
        [id, userId, courseId]
      );
      return successResponse({ saved: true });
    }
  } catch (error) {
    console.error("Error in course save:", error);
    return errorResponse(
      "خطایی در ذخیره دوره رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
