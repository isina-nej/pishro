import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { query } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, type } = body;

    if (!courseId || !type || !["LIKE", "DISLIKE"].includes(type)) {
      return errorResponse(
        "پارامترهای نامعتبر",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // In production, get actual user ID from session
    // For testing: use hardcoded test user ID
    const userId = "test-user-1";

    // Check if like already exists
    const existing = await query(
      `SELECT id, type FROM CourseLike WHERE userId = ? AND courseId LIMIT 1`,
      [userId, courseId]
    );

    if (existing.length > 0) {
      if (existing[0].type === type) {
        // Remove like/dislike
        await query(`DELETE FROM CourseLike WHERE id = ?`, [existing[0].id]);
      } else {
        // Update type
        await query(`UPDATE CourseLike SET type = ? WHERE id`, [type, existing[0].id]);
      }
    } else {
      // Create new like/dislike
      const id = randomUUID();
      await query(
        `INSERT INTO CourseLike (id, userId, courseId, type) VALUES (?, ?, ?)`,
        [id, userId, courseId, type]
      );
    }

    return successResponse({ success: true });
  } catch (error) {
    console.error("Error in course like:", error);
    return errorResponse(
      "خطایی در ثبت نظر رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
