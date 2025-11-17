/**
 * Admin Broadcast SMS to Newsletter Subscribers API
 * POST /api/admin/newsletter-subscribers/broadcast-sms - Send SMS to all newsletter subscribers
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendSmsMelipayamak } from "@/lib/sms";
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

    // Send SMS to all subscribers
    const results = {
      total: subscribers.length,
      success: 0,
      failed: 0,
      failedPhones: [] as string[],
    };

    // Helper function to add delay between requests
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const subscriber of subscribers) {
      try {
        await sendSmsMelipayamak(subscriber.phone, message.trim());
        results.success++;

        // Add small delay to prevent overwhelming the SMS service (200ms)
        await delay(200);
      } catch (error) {
        console.error(`Failed to send SMS to ${subscriber.phone}:`, error);
        results.failed++;
        results.failedPhones.push(subscriber.phone);
      }
    }

    // Return results
    return successResponse(
      {
        ...results,
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
