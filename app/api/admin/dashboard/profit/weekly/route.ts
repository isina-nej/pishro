/**
 * Admin Dashboard Weekly Profit API
 * GET /api/admin/dashboard/profit/weekly?period=this_week|last_week - دریافت داده‌های سود هفتگی
 */

import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  validationError,
  ErrorCodes
} from "@/lib/api-response";
import { corsPreflightResponse, addCorsHeaders } from "@/lib/cors";
import {
  getWeeklyProfit,
  getCachedData,
  setCachedData
} from "@/lib/services/dashboard-service";
import { WeeklyProfit } from "@/types/dashboard";

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req.headers.get("origin"));
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  try {
    const adminAuth = await getAdminAuth(req);

    if (!adminAuth) {
      const response = errorResponse("دسترسی محدود به ادمین", ErrorCodes.UNAUTHORIZED);
      return addCorsHeaders(response, origin);
    }

    // دریافت پارامترها
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get("period") as
      | "this_week"
      | "last_week"
      | null;

    // اعتبارسنجی
    if (!period || (period !== "this_week" && period !== "last_week")) {
      const response = validationError({
        period: "دوره زمانی باید this_week یا last_week باشد"
      });
      return addCorsHeaders(response, origin);
    }

    // بررسی کش
    const cacheKey = `dashboard-profit-${period}`;
    const cachedData = getCachedData<WeeklyProfit>(cacheKey);

    if (cachedData) {
      const response = successResponse(cachedData, "داده‌ها از کش بارگذاری شد");
      return addCorsHeaders(response, origin);
    }

    // دریافت داده‌ها
    const profit = await getWeeklyProfit(period);

    // ذخیره در کش
    setCachedData(cacheKey, profit);

    const response = successResponse(profit, "داده‌ها با موفقیت دریافت شد");
    return addCorsHeaders(response, origin);
  } catch (error) {
    console.error("Error fetching weekly profit:", error);
    const response = errorResponse(
      "خطا در دریافت داده‌های سود هفتگی",
      ErrorCodes.DATABASE_ERROR
    );
    return addCorsHeaders(response, origin);
  }
}
