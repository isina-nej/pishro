// @/app/api/admin/skyroom-classes/[id]/route.ts
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import {
  getSkyRoomClassById,
  updateSkyRoomClass,
  deleteSkyRoomClass,
} from "@/lib/services/skyroom-service";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  validationError,
  ErrorCodes,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/skyroom-classes/[id]
 * دریافت یک کلاس اسکای‌روم (برای ادمین)
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز");
    }

    const { id } = await params;
    const skyRoomClass = await getSkyRoomClassById(id);

    if (!skyRoomClass) {
      return notFoundResponse("کلاس مورد نظر یافت نشد");
    }

    return successResponse(skyRoomClass, "کلاس با موفقیت دریافت شد");
  } catch (error) {
    console.error("[GET /api/admin/skyroom-classes/[id]] error:", error);
    return errorResponse(
      "خطایی در دریافت کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * PATCH /api/admin/skyroom-classes/[id]
 * به‌روزرسانی یک کلاس اسکای‌روم (برای ادمین)
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز");
    }

    const { id } = await params;
    const body = await req.json();

    // Validation
    const errors: { [key: string]: string } = {};

    if (body.title !== undefined && body.title.trim().length < 3) {
      errors.title = "عنوان باید حداقل 3 کاراکتر باشد";
    }

    if (body.meetingLink !== undefined && body.meetingLink.trim().length === 0) {
      errors.meetingLink = "لینک جلسه نمی‌تواند خالی باشد";
    } else if (body.meetingLink) {
      // Validate URL format
      try {
        new URL(body.meetingLink);
      } catch {
        errors.meetingLink = "فرمت لینک جلسه معتبر نیست";
      }
    }

    if (body.capacity !== undefined && body.capacity !== null && body.capacity <= 0) {
      errors.capacity = "ظرفیت کلاس باید مثبت باشد";
    }

    if (body.startDate && body.endDate) {
      const start = new Date(body.startDate);
      const end = new Date(body.endDate);
      if (end <= start) {
        errors.endDate = "تاریخ پایان باید بعد از تاریخ شروع باشد";
      }
    }

    if (Object.keys(errors).length > 0) {
      return validationError(errors, "اطلاعات ارسالی معتبر نیست");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description?.trim();
    if (body.instructor !== undefined) updateData.instructor = body.instructor?.trim();
    if (body.startDate !== undefined) updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.meetingLink !== undefined) updateData.meetingLink = body.meetingLink.trim();
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail?.trim();
    if (body.duration !== undefined) updateData.duration = body.duration?.trim();
    if (body.capacity !== undefined) updateData.capacity = body.capacity;
    if (body.level !== undefined) updateData.level = body.level?.trim();
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;

    const skyRoomClass = await updateSkyRoomClass(id, updateData);

    return successResponse(skyRoomClass, "کلاس با موفقیت به‌روزرسانی شد");
  } catch (error) {
    console.error("[PATCH /api/admin/skyroom-classes/[id]] error:", error);
    return errorResponse(
      "خطایی در به‌روزرسانی کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * DELETE /api/admin/skyroom-classes/[id]
 * حذف یک کلاس اسکای‌روم (برای ادمین)
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorizedResponse("دسترسی غیرمجاز");
    }

    const { id } = await params;

    // Check if class exists
    const skyRoomClass = await getSkyRoomClassById(id);
    if (!skyRoomClass) {
      return notFoundResponse("کلاس مورد نظر یافت نشد");
    }

    await deleteSkyRoomClass(id);

    return successResponse(null, "کلاس با موفقیت حذف شد");
  } catch (error) {
    console.error("[DELETE /api/admin/skyroom-classes/[id]] error:", error);
    return errorResponse(
      "خطایی در حذف کلاس رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
