/**
 * Investment Models API (Public)
 * GET /api/investment-models - Get published investment models page
 */

import { NextRequest } from "next/server";
import { getInvestmentModelsPage } from "@/lib/services/investment-models-service";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const page = await getInvestmentModelsPage();

    return successResponse(page);
  } catch (error) {
    console.error("Error fetching investment models page:", error);
    return errorResponse(
      "خطا در دریافت مدل‌های سرمایه‌ گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
