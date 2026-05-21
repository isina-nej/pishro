/**
 * Admin Dashboard Stats API
 * GET /api/admin/dashboard/stats - دریافت آمار کلی داشبورد
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  ErrorCodes
} from "@/lib/api-response";
import { corsPreflightResponse, addCorsHeaders } from "@/lib/cors";
import {
  getDashboardStats,
  getCachedData,
  setCachedData
} from "@/lib/services/dashboard-service";
import { DashboardStats } from "@/types/dashboard";

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req.headers.get("origin"));
}

export async function GET(_req: NextRequest) {
  const origin = _req.headers.get("origin");
  try {
    const adminAuth = await getAdminAuth(_req);

    if (!adminAuth) {
      const response = errorResponse("دسترسی محدود به ادمین", ErrorCodes.UNAUTHORIZED);
      return addCorsHeaders(response, origin);
    }

    // بررسی کش
    const cacheKey = "dashboard-stats";
    const cachedData = getCachedData<DashboardStats>(cacheKey);

    if (cachedData) {
      const response = successResponse(cachedData, "آمار از کش بارگذاری شد");
      return addCorsHeaders(response, origin);
    }

    // دریافت آمار
    const stats = await getDashboardStats();

    // ذخیره در کش
    setCachedData(cacheKey, stats);

    const response = successResponse(stats, "آمار با موفقیت دریافت شد");
    return addCorsHeaders(response, origin);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    const response = errorResponse(
      "خطا در دریافت آمار داشبورد",
      ErrorCodes.DATABASE_ERROR
    );
    return addCorsHeaders(response, origin);
  }
}
