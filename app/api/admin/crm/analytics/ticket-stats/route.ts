/**
 * Admin CRM Analytics - Ticket Stats API
 * GET /api/admin/crm/analytics/ticket-stats - توزیع وضعیت تیکت‌های پشتیبانی و میانگین زمان حل
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { errorResponse, successResponse, ErrorCodes, HttpStatus } from "@/lib/api-response";
import { getTicketStats } from "@/lib/services/dashboard-service";

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

    // کش‌گذاری در سطح سرویس انجام می‌شود (getTicketStats)
    const data = await getTicketStats();

    return successResponse(data, "آمار تیکت‌های پشتیبانی با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching CRM ticket stats:", error);
    return errorResponse(
      "خطا در دریافت آمار تیکت‌های پشتیبانی",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
