/**
 * Admin Images Statistics API
 * GET /api/admin/images/stats - Get statistics about user's images
 */

import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { auth } from "@/auth";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  ErrorCodes
} from "@/lib/api-response";
import { getUserImageStats } from "@/lib/services/image-service";
import { getAdminAuth } from "@/lib/auth-simple";

export async function GET(_req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(req);
if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (!adminAuth) {
      return errorResponse("دسترسی محدود به ادمین", ErrorCodes.UNAUTHORIZED);
    }

    const stats = await getUserImageStats(session.user.id);

    return successResponse(stats);
  } catch (error) {
    console.error("Error fetching image stats:", error);
    return errorResponse(
      "خطا در دریافت آمار تصاویر",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
