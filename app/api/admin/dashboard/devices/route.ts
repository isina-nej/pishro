/**
 * Admin Dashboard Device Stats API
 * GET /api/admin/dashboard/devices?period=monthly|yearly - دریافت آمار دستگاه‌ها
 */

import { NextRequest } from "next/server";
import {
  errorResponse,
  successResponse,
  validationError,
  ErrorCodes
} from "@/lib/api-response";
import {
  getDeviceStats,
  getCachedData,
  setCachedData
} from "@/lib/services/dashboard-service";
import { DeviceStats } from "@/types/dashboard";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
// احراز هویت - فقط ادمین‌ها
    if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }

    if (session.user.role !== "ADMIN") {
      return errorResponse("دسترسی محدود به ادمین", ErrorCodes.UNAUTHORIZED);
    }

    // دریافت پارامترها
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get("period") as "monthly" | "yearly" | null;

    // اعتبارسنجی
    if (!period || (period !== "monthly" && period !== "yearly")) {
      return validationError({
        period: "دوره زمانی باید monthly یا yearly باشد"
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
