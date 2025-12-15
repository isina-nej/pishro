// @/app/api/landing/home/route.ts

import { NextRequest } from "next/server";
import {
  getHomeLandingData,
  getMobileScrollerSteps,
} from "@/lib/services/landing-service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(_req: NextRequest) {
  try {
    const homeLanding = await getHomeLandingData();
    const mobileSteps = await getMobileScrollerSteps();

    if (!homeLanding) {
      return errorResponse(
        "داده‌های صفحه اصلی یافت نشد",
        "HOME_LANDING_NOT_FOUND",
        404
      );
    }

    return successResponse({
      landing: homeLanding,
      mobileSteps,
    });
  } catch (error) {
    console.error("Error in GET /api/landing/home:", error);
    return errorResponse("خطا در دریافت اطلاعات صفحه اصلی", "DATABASE_ERROR");
  }
}
