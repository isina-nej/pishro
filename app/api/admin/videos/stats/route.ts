/**
 * Admin Videos Statistics API
 * GET /api/admin/videos/stats - Get comprehensive statistics about videos
 */

import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";
import { getVideoStats } from "@/lib/services/video-service";

export async function GET(req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse(
        "لطفا وارد شوید",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
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
