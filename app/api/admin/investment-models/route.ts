/**
 * Admin Investment Models Management API
 * GET /api/admin/investment-models - List all investment models
 * POST /api/admin/investment-models - Create a new investment model
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  createInvestmentModel,
} from "@/lib/services/investment-models-service";
import {
  errorResponse,
  unauthorizedResponse,
  createdResponse,
  ErrorCodes,
  forbiddenResponse,
  validationError,
} from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود. فقط ادمین.");
    }

    const body = await req.json();
    const {
      investmentModelsPageId,
      type,
      title,
      description,
      icon,
      color,
      gradient,
      features = [],
      benefits = [],
      ctaText,
      ctaLink,
      ctaIsScroll = false,
      contactTitle,
      contactDescription,
      contacts = [],
      order = 0,
      published = true,
    } = body;

    // Validation
    const errors: { [key: string]: string } = {};

    if (!investmentModelsPageId) {
      errors.investmentModelsPageId = "شناسه صفحه الزامی است";
    }

    if (!type || (type !== "in-person" && type !== "online")) {
      errors.type = "نوع باید 'in-person' یا 'online' باشد";
    }

    if (!title || title.trim().length < 3) {
      errors.title = "عنوان الزامی است و باید حداقل 3 کاراکتر باشد";
    }

    if (!description || description.trim().length < 10) {
      errors.description = "توضیحات الزامی است و باید حداقل 10 کاراکتر باشد";
    }

    if (!icon) {
      errors.icon = "آیکون الزامی است";
    }

    if (!color) {
      errors.color = "رنگ الزامی است";
    }

    if (!gradient) {
      errors.gradient = "gradient الزامی است";
    }

    if (!ctaText || ctaText.trim().length < 3) {
      errors.ctaText = "متن دکمه الزامی است";
    }

    if (Object.keys(errors).length > 0) {
      return validationError(errors, "اطلاعات ارسالی معتبر نیست");
    }

    // Create investment model
    const item = await createInvestmentModel({
      investmentModelsPageId,
      type,
      title: title.trim(),
      description: description.trim(),
      icon,
      color,
      gradient,
      features,
      benefits,
      ctaText: ctaText.trim(),
      ctaLink,
      ctaIsScroll,
      contactTitle,
      contactDescription,
      contacts,
      order,
      published,
    });

    return createdResponse(item, "مدل سرمایه‌ گذاری با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating investment model:", error);
    return errorResponse(
      "خطا در ایجاد مدل سرمایه‌ گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
