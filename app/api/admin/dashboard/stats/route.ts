/**
 * Admin Dashboard Stats API
 * GET /api/admin/dashboard/stats - دریافت آمار کلی داشبورد
 */

import { NextRequest } from "next/server";
import {
  errorResponse,
  successResponse,
  ErrorCodes
} from "@/lib/api-response";
import {
  getDashboardStats,
  getCachedData,
  setCachedData
} from "@/lib/services/dashboard-service";
import { DashboardStats } from "@/types/dashboard";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();\n// احراز هویت - فقط ادمین‌ها
    if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }

    if (session.user.role !== "ADMIN") {
      return errorResponse("دسترسی محدود به ادمین", ErrorCodes.UNAUTHORIZED);
    }

    // بررسی کش
    const cacheKey = "dashboard-stats";
    const cachedData = getCachedData<DashboardStats>(cacheKey);

    if (cachedData) {
      return successResponse(cachedData, "آمار از کش بارگذاری شد");
    }

    // دریافت آمار
    const stats = await getDashboardStats();

    // ذخیره در کش
    setCachedData(cacheKey, stats);

    return successResponse(stats, "آمار با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return errorResponse(
      "خطا در دریافت آمار داشبورد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
