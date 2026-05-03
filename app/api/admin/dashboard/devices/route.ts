/**
 * Admin Dashboard Device Stats API
 * GET /api/admin/dashboard/devices?period=monthly|yearly - دریافت آمار دستگاه‌ها
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
  getDeviceStats,
  getCachedData,
  setCachedData,
} from "@/lib/services/dashboard-service";
import { DeviceStats } from "@/types/dashboard";

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
    const period = searchParams.get("period") as "monthly" | "yearly" | null;

    // اعتبارسنجی
    if (!period || (period !== "monthly" && period !== "yearly")) {
      return validationError({
        period: "دوره زمانی باید monthly یا yearly باشد",
      });
    }

    // بررسی کش
    const cacheKey = `dashboard-devices-${period}`;
    const cachedData = getCachedData<DeviceStats>(cacheKey);

    if (cachedData) {
      return successResponse(cachedData, "داده‌ها از کش بارگذاری شد");
    }

    // دریافت داده‌ها
    const devices = await getDeviceStats(period);

    // ذخیره در کش
    setCachedData(cacheKey, devices);

    return successResponse(devices, "داده‌ها با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching device stats:", error);
    return errorResponse(
      "خطا در دریافت آمار دستگاه‌ها",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
