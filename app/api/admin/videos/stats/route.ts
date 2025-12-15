/**
 * Admin Videos Statistics API
 * GET /api/admin/videos/stats - Get comprehensive statistics about videos
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  errorResponse,
  unauthorizedResponse,
  successResponse,
  ErrorCodes,
  forbiddenResponse,
} from "@/lib/api-response";
import { getVideoStats } from "@/lib/services/video-service";

export async function GET(_req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود به ادمین");
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
