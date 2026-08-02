/**
 * Admin Dashboard Device Stats API
 * GET /api/admin/dashboard/devices?period=monthly|yearly - دریافت آمار دستگاه‌ها
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  validationError,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";
import { corsPreflightResponse, addCorsHeaders } from "@/lib/cors";
import {
  getDeviceStats,
  getCachedData,
  setCachedData
} from "@/lib/services/dashboard-service";
import { DeviceStats } from "@/types/dashboard";

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req.headers.get("origin"));
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  try {
    const adminAuth = await getAdminAuth(req);

    if (!adminAuth) {
      const response = errorResponse(
        "دسترسی محدود به ادمین",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
      return addCorsHeaders(response, origin);
    }

    // دریافت پارامترها
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get("period") as "monthly" | "yearly" | null;

    // اعتبارسنجی
    if (!period || (period !== "monthly" && period !== "yearly")) {
      const response = validationError({
        period: "دوره زمانی باید monthly یا yearly باشد"
      });
      return addCorsHeaders(response, origin);
    }

    // بررسی کش
    const cacheKey = `dashboard-devices-${period}`;
    const cachedData = getCachedData<DeviceStats>(cacheKey);

    if (cachedData) {
      const response = successResponse(cachedData, "داده‌ها از کش بارگذاری شد");
      return addCorsHeaders(response, origin);
    }

    // دریافت داده‌ها
    const devices = await getDeviceStats(period);

    // ذخیره در کش
    setCachedData(cacheKey, devices);

    const response = successResponse(devices, "داده‌ها با موفقیت دریافت شد");
    return addCorsHeaders(response, origin);
  } catch (error) {
    console.error("Error fetching device stats:", error);
    const response = errorResponse(
      "خطا در دریافت آمار دستگاه‌ها",
      ErrorCodes.DATABASE_ERROR
    );
    return addCorsHeaders(response, origin);
  }
}
