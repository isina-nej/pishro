/**
 * Admin Images Statistics API
 * GET /api/admin/images/stats - Get statistics about user's images
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
import { getUserImageStats } from "@/lib/services/image-service";

export async function GET(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود به ادمین");
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
