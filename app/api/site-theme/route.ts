/**
 * Public site theme
 * GET /api/site-theme — palette + default mode for the live site
 */

import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { getPublicSiteTheme } from "@/lib/services/settings-service";

export async function GET() {
  try {
    const theme = await getPublicSiteTheme();
    return successResponse(theme, "تم سایت");
  } catch (error) {
    console.error("Error fetching site theme:", error);
    return errorResponse("خطا در دریافت تم سایت", ErrorCodes.DATABASE_ERROR);
  }
}
