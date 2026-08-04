/**
 * Admin Settings API
 * GET /api/admin/settings - Get site settings
 * PATCH /api/admin/settings - Update site settings
 */

import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  ErrorCodes,
  validationError,
  HttpStatus,
} from "@/lib/api-response";
import {
  getSettings,
  updateSettings,
  UpdateSettingsInput,
} from "@/lib/services/settings-service";
import { isValidThemeMode } from "@/lib/theme/landing-palettes";
import { isKnownPaletteId } from "@/lib/services/custom-palette-service";

/**
 * GET /api/admin/settings
 * Get current site settings (Admin only)
 */
export async function GET(_req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(_req);
    if (!adminAuth) {
      return errorResponse(
        "لطفا وارد شوید",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

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

/**
 * PATCH /api/admin/settings
 * Update site settings (Admin only)
 */
export async function PATCH(req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse(
        "لطفا وارد شوید",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    if (adminAuth.role !== "ADMIN") {
      return errorResponse(
        "فقط ادمین می‌تواند تنظیمات را تغییر دهد",
        ErrorCodes.FORBIDDEN,
        undefined,
        HttpStatus.FORBIDDEN
      );
    }

    const body = (await req.json()) as UpdateSettingsInput;

    if (Object.keys(body).length === 0) {
      return validationError(
        { fields: "حداقل یک فیلد برای به‌روزرسانی الزامی است" },
        "داده‌ای برای به‌روزرسانی ارسال نشده است"
      );
    }

    if (
      body.zarinpalMerchantId !== undefined &&
      body.zarinpalMerchantId !== null &&
      body.zarinpalMerchantId !== ""
    ) {
      if (body.zarinpalMerchantId.length !== 36) {
        return validationError(
          {
            zarinpalMerchantId:
              "شناسه پذیرنده باید 36 کاراکتر باشد (فرمت UUID)",
          },
          "فرمت شناسه پذیرنده صحیح نیست"
        );
      }
    }

    if (body.paletteId !== undefined) {
      const known = await isKnownPaletteId(body.paletteId);
      if (!known) {
        return validationError(
          { paletteId: "شناسه پالت معتبر نیست" },
          "پالت رنگی انتخاب‌شده معتبر نیست"
        );
      }
    }

    if (body.themeMode !== undefined) {
      if (!isValidThemeMode(body.themeMode)) {
        return validationError(
          { themeMode: "حالت تم باید light، dark یا system باشد" },
          "حالت تم معتبر نیست"
        );
      }
    }

    const updated = await updateSettings(body);

    // Apply new palette / default theme on the public site immediately
    revalidatePath("/", "layout");

    return successResponse(updated, "تنظیمات با موفقیت به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating settings:", error);
    return errorResponse(
      "خطا در به‌روزرسانی تنظیمات",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
