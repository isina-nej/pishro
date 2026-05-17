/**
 * Admin Dashboard Monthly Payments API
 * GET /api/admin/dashboard/payments/monthly?period=monthly|yearly - دریافت داده‌های پرداخت ماهانه
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  validationError,
  ErrorCodes
} from "@/lib/api-response";
import { corsPreflightResponse, addCorsHeaders } from "@/lib/cors";
import {
  getMonthlyPayments,
  getCachedData,
  setCachedData
} from "@/lib/services/dashboard-service";
import { MonthlyPayments } from "@/types/dashboard";

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
    const period = searchParams.get("period") as "monthly" | "yearly" | null;

    // اعتبارسنجی
    if (!period || (period !== "monthly" && period !== "yearly")) {
      const response = validationError({
        period: "دوره زمانی باید monthly یا yearly باشد"
      });
      return addCorsHeaders(response, origin);
    }

    // بررسی کش
    const cacheKey = `dashboard-payments-${period}`;
    const cachedData = getCachedData<MonthlyPayments>(cacheKey);

    if (cachedData) {
      const response = successResponse(cachedData, "داده‌ها از کش بارگذاری شد");
      return addCorsHeaders(response, origin);
    }

    // دریافت داده‌ها
    const payments = await getMonthlyPayments(period);

    // ذخیره در کش
    setCachedData(cacheKey, payments);

    const response = successResponse(payments, "داده‌ها با موفقیت دریافت شد");
    return addCorsHeaders(response, origin);
  } catch (error) {
    console.error("Error fetching monthly payments:", error);
    const response = errorResponse(
      "خطا در دریافت داده‌های پرداخت",
      ErrorCodes.DATABASE_ERROR
    );
    return addCorsHeaders(response, origin);
  }
}
