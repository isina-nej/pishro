/**
 * Admin Dashboard Monthly Payments API
 * GET /api/admin/dashboard/payments/monthly?period=monthly|yearly - دریافت داده‌های پرداخت ماهانه
 */

import { NextRequest } from "next/server";
import {
  errorResponse,
  successResponse,
  validationError,
  ErrorCodes
} from "@/lib/api-response";
import {
  getMonthlyPayments,
  getCachedData,
  setCachedData
} from "@/lib/services/dashboard-service";
import { MonthlyPayments } from "@/types/dashboard";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();\n// احراز هویت - فقط ادمین‌ها
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
    const cacheKey = `dashboard-payments-${period}`;
    const cachedData = getCachedData<MonthlyPayments>(cacheKey);

    if (cachedData) {
      return successResponse(cachedData, "داده‌ها از کش بارگذاری شد");
    }

    // دریافت داده‌ها
    const payments = await getMonthlyPayments(period);

    // ذخیره در کش
    setCachedData(cacheKey, payments);

    return successResponse(payments, "داده‌ها با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching monthly payments:", error);
    return errorResponse(
      "خطا در دریافت داده‌های پرداخت",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
