// @/app/api/admin/skyroom-classes/route.ts
import { NextRequest } from "next/server";
import {
  getAllSkyRoomClassesForAdmin,
  createSkyRoomClass
} from "@/lib/services/skyroom-service";
import {
  successResponse,
  errorResponse,
  validationError,
  ErrorCodes
} from "@/lib/api-response";

/**
 * GET /api/admin/skyroom-classes
 * دریافت تمام لینک‌های همایش (برای ادمین)
 */
export async function GET(_req: NextRequest) {
  try {
    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const classes = await getAllSkyRoomClassesForAdmin();

    return successResponse(classes, "لینک‌های همایش با موفقیت دریافت شدند");
  } catch (error) {
    console.error("[GET /api/admin/skyroom-classes] error:", error);
    return errorResponse(
      "خطایی در دریافت لینک‌های همایش رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * POST /api/admin/skyroom-classes
 * ایجاد لینک همایش جدید (برای ادمین)
 */
export async function POST(req: NextRequest) {
  try {
    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const body = await req.json();
    const { meetingLink, published } = body;

    // Validation
    const errors: { [key: string]: string } = {};

    if (!meetingLink || meetingLink.trim().length === 0) {
      errors.meetingLink = "لینک همایش الزامی است";
    } else {
      // Validate URL format
      try {
        new URL(meetingLink);
      } catch {
        errors.meetingLink = "فرمت لینک همایش معتبر نیست";
      }
    }

    if (Object.keys(errors).length > 0) {
      return validationError(errors, "اطلاعات ارسالی معتبر نیست");
    }

    const skyRoomClass = await createSkyRoomClass({
      meetingLink: meetingLink.trim(),
      published
    });

    return successResponse(skyRoomClass, "لینک همایش با موفقیت ایجاد شد");
  } catch (error) {
    console.error("[POST /api/admin/skyroom-classes] error:", error);
    return errorResponse(
      "خطایی در ایجاد لینک همایش رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
