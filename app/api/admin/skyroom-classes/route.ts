// @/app/api/admin/skyroom-classes/route.ts
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import {
  getAllSkyRoomClassesForAdmin,
  createSkyRoomClass,
} from "@/lib/services/skyroom-service";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationError,
  ErrorCodes,
} from "@/lib/api-response";

/**
 * GET /api/admin/skyroom-classes
 * دریافت تمام کلاس‌های اسکای‌روم (برای ادمین)
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز");
    }

    const classes = await getAllSkyRoomClassesForAdmin();

    return successResponse(classes, "کلاس‌ها با موفقیت دریافت شدند");
  } catch (error) {
    console.error("[GET /api/admin/skyroom-classes] error:", error);
    return errorResponse(
      "خطایی در دریافت کلاس‌ها رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * POST /api/admin/skyroom-classes
 * ایجاد کلاس اسکای‌روم جدید (برای ادمین)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز");
    }

    const body = await req.json();
    const {
      title,
      description,
      instructor,
      startDate,
      endDate,
      meetingLink,
      thumbnail,
      duration,
      capacity,
      level,
      order,
      published,
    } = body;

    // Validation
    const errors: { [key: string]: string } = {};

    if (!title || title.trim().length < 3) {
      errors.title = "عنوان الزامی است و باید حداقل 3 کاراکتر باشد";
    }

    if (!meetingLink || meetingLink.trim().length === 0) {
      errors.meetingLink = "لینک جلسه الزامی است";
    } else {
      // Validate URL format
      try {
        new URL(meetingLink);
      } catch {
        errors.meetingLink = "فرمت لینک جلسه معتبر نیست";
      }
    }

    if (capacity !== undefined && capacity !== null && capacity <= 0) {
      errors.capacity = "ظرفیت کلاس باید مثبت باشد";
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        errors.endDate = "تاریخ پایان باید بعد از تاریخ شروع باشد";
      }
    }

    if (Object.keys(errors).length > 0) {
      return validationError(errors, "اطلاعات ارسالی معتبر نیست");
    }

    const skyRoomClass = await createSkyRoomClass({
      title: title.trim(),
      description: description?.trim(),
      instructor: instructor?.trim(),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      meetingLink: meetingLink.trim(),
      thumbnail: thumbnail?.trim(),
      duration: duration?.trim(),
      capacity,
      level: level?.trim(),
      order,
      published,
    });

    return successResponse(skyRoomClass, "کلاس با موفقیت ایجاد شد");
  } catch (error) {
    console.error("[POST /api/admin/skyroom-classes] error:", error);
    return errorResponse(
      "خطایی در ایجاد کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
