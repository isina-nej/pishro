/**
 * Admin Settings API
 * GET /api/admin/settings - Get site settings
 * PATCH /api/admin/settings - Update site settings
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  errorResponse,
  successResponse,
  ErrorCodes,
  validationError
} from "@/lib/api-response";
  getSettings,
  updateSettings,
  UpdateSettingsInput
} from "@/lib/services/settings-service";
 * GET /api/admin/settings
 * Get current site settings (Admin only)
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("دسترسی محدود به ادمین", ErrorCodes.UNAUTHORIZED);
    const settings = await getSettings();
    return successResponse(settings, "تنظیمات با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching settings:", error);
    return errorResponse(
      "خطا در دریافت تنظیمات",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
 * PATCH /api/admin/settings
 * Update site settings (Admin only)
 *
 * Request body:
 * {
 *   zarinpalMerchantId?: string;
 *   siteName?: string;
 *   siteDescription?: string;
 *   supportEmail?: string;
 *   supportPhone?: string;
 * }
export async function PATCH(req: NextRequest) {
    // Parse request body
    const body: UpdateSettingsInput = await req.json();
    // Validate at least one field is provided
    if (Object.keys(body).length === 0) {
      return validationError(
        { fields: "حداقل یک فیلد برای به‌روزرسانی الزامی است" },
        "داده‌ای برای به‌روزرسانی ارسال نشده است"
      );
    // Validate zarinpalMerchantId format if provided (should be 36 characters)
    if (
      body.zarinpalMerchantId !== undefined &&
      body.zarinpalMerchantId !== null &&
      body.zarinpalMerchantId !== ""
    ) {
      if (body.zarinpalMerchantId.length !== 36) {
        return validationError(
          {
            zarinpalMerchantId:
              "شناسه پذیرنده باید 36 کاراکتر باشد (فرمت UUID)"
          },
          "فرمت شناسه پذیرنده صحیح نیست"
        );
      }
    // Update settings
    const updated = await updateSettings(body);
    return successResponse(updated, "تنظیمات با موفقیت به‌روزرسانی شد");
    console.error("Error updating settings:", error);
      "خطا در به‌روزرسانی تنظیمات",
