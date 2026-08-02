/**
 * Admin CRM Analytics - Lead Conversion API
 * GET /api/admin/crm/analytics/lead-conversion?period=monthly|weekly
 * توزیع وضعیت سرنخ‌ها و نرخ تبدیل
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { errorResponse, successResponse, ErrorCodes, HttpStatus } from "@/lib/api-response";
import {
  getLeadConversionStats,
  type CrmLeadConversionPeriod,
} from "@/lib/services/dashboard-service";

function parsePeriod(value: string | null): CrmLeadConversionPeriod {
  return value === "weekly" ? "weekly" : "monthly";
}

export async function GET(req: NextRequest) {
  try {
    const adminAuth = getAdminAuthFromHeaders(req.headers);
    if (!adminAuth) {
      return errorResponse(
        "دسترسی محدود به ادمین",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    const period = parsePeriod(req.nextUrl.searchParams.get("period"));

    // کش‌گذاری در سطح سرویس انجام می‌شود (getLeadConversionStats)
    const data = await getLeadConversionStats(period);

    return successResponse(data, "آمار تبدیل سرنخ‌ها با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching CRM lead conversion stats:", error);
    return errorResponse(
      "خطا در دریافت آمار تبدیل سرنخ‌ها",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
