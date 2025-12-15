/**
 * Admin Dashboard Weekly Profit API
 * GET /api/admin/dashboard/profit/weekly?period=this_week|last_week - دریافت داده‌های سود هفتگی
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  successResponse,
  validationError,
  ErrorCodes,
} from "@/lib/api-response";
import {
  getWeeklyProfit,
  getCachedData,
  setCachedData,
} from "@/lib/services/dashboard-service";
import { WeeklyProfit } from "@/types/dashboard";

export async function GET(req: NextRequest) {
  try {
    // احراز هویت - فقط ادمین‌ها
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }

    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود به ادمین");
    }

    // دریافت پارامترها
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get("period") as
      | "this_week"
      | "last_week"
      | null;

    // اعتبارسنجی
    if (!period || (period !== "this_week" && period !== "last_week")) {
      return validationError({
        period: "دوره زمانی باید this_week یا last_week باشد",
      });
    }

    // بررسی کش
    const cacheKey = `dashboard-profit-${period}`;
    const cachedData = getCachedData<WeeklyProfit>(cacheKey);

    if (cachedData) {
      return successResponse(cachedData, "داده‌ها از کش بارگذاری شد");
    }

    // دریافت داده‌ها
    const profit = await getWeeklyProfit(period);

    // ذخیره در کش
    setCachedData(cacheKey, profit);

    return successResponse(profit, "داده‌ها با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching weekly profit:", error);
    return errorResponse(
      "خطا در دریافت داده‌های سود هفتگی",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
