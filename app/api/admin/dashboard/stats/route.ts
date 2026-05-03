/**
 * Admin Dashboard Stats API
 * GET /api/admin/dashboard/stats - دریافت آمار کلی داشبورد
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  successResponse,
  ErrorCodes,
} from "@/lib/api-response";
import {
  getDashboardStats,
  getCachedData,
  setCachedData,
} from "@/lib/services/dashboard-service";
import { DashboardStats } from "@/types/dashboard";

export async function GET(_req: NextRequest) {
  try {
    // احراز هویت - فقط ادمین‌ها
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }

    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود به ادمین");
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
