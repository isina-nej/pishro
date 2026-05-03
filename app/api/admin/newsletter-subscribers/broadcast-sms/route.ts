/**
 * Admin Broadcast SMS to Newsletter Subscribers API
 * POST /api/admin/newsletter-subscribers/broadcast-sms - Send SMS to all newsletter subscribers
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendBulkSmsMelipayamak } from "@/lib/sms";
import {
  errorResponse,
  unauthorizedResponse,
  successResponse,
  validationError,
  forbiddenResponse,
  ErrorCodes,
} from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا ابتدا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی غیرمجاز. فقط ادمین‌ها اجازه دارند.");
    }

    // Get message text from request body
    const body = await req.json();
    const { message } = body;

    // Validation
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return validationError(
        { message: "متن پیامک الزامی است" },
        "متن پیامک نمی‌تواند خالی باشد"
      );
    }

    // Check message length (Persian SMS limit is around 70 characters per message)
    if (message.trim().length > 500) {
      return validationError(
        { message: "متن پیامک نباید بیشتر از 500 کاراکتر باشد" },
        "متن پیامک خیلی طولانی است"
      );
    }

    // Get all newsletter subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany({
      select: {
        phone: true,
      },
    });

    if (subscribers.length === 0) {
      return errorResponse(
        "هیچ عضوی در باشگاه خبری یافت نشد",
        ErrorCodes.NOT_FOUND
      );
    }

    // Extract phone numbers
    const phones = subscribers.map(s => s.phone);

    // Send SMS to all subscribers using bulk sending
    // batchSize = 50 means 50 phones per API call
    const results = await sendBulkSmsMelipayamak(phones, message.trim(), 50);

    // Return results
    return successResponse(
      {
        total: results.total,
        success: results.success,
        failed: results.failed,
        failedPhones: results.failedPhones,
        message: `پیامک با موفقیت به ${results.success} نفر از ${results.total} عضو ارسال شد${
          results.failed > 0 ? `. ${results.failed} مورد با خطا مواجه شد` : ""
        }`,
      },
      `ارسال پیامک به ${results.success} نفر انجام شد`
    );
  } catch (error) {
    console.error("Error broadcasting SMS:", error);
    return errorResponse(
      "خطا در ارسال پیامک گروهی",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
