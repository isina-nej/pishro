/**
 * Admin CRM Analytics - Pipeline Funnel API
 * GET /api/admin/crm/analytics/pipeline-funnel - قیف فروش (تعداد و مبلغ معاملات به تفکیک مرحله)
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { errorResponse, successResponse, ErrorCodes } from "@/lib/api-response";
import { getCrmPipelineFunnel } from "@/lib/services/dashboard-service";

export async function GET(req: NextRequest) {
  try {
    const adminAuth = getAdminAuthFromHeaders(req.headers);
    if (!adminAuth) {
      return errorResponse("دسترسی محدود به ادمین", ErrorCodes.UNAUTHORIZED);
    }

    // کش‌گذاری در سطح سرویس انجام می‌شود (getCrmPipelineFunnel)
    const data = await getCrmPipelineFunnel();

    return successResponse(data, "قیف فروش با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching CRM pipeline funnel:", error);
    return errorResponse(
      "خطا در دریافت قیف فروش",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
