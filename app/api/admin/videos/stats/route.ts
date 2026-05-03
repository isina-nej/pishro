/**
 * Admin Videos Statistics API
 * GET /api/admin/videos/stats - Get comprehensive statistics about videos
 */

import { NextRequest } from "next/server";
import {
  errorResponse,
  successResponse,
  ErrorCodes
} from "@/lib/api-response";
import { getVideoStats } from "@/lib/services/video-service";

export async function GET(_req: NextRequest) {
  try {
    if (!session?.user) {
      return "لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return "دسترسی محدود به ادمین");
    }

    const stats = await getVideoStats();

    return successResponse(stats);
  } catch (error) {
    console.error("Error fetching video stats:", error);
    return errorResponse(
      "خطا در دریافت آمار ویدیوها",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
