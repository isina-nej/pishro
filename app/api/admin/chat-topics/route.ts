/**
 * GET /api/admin/chat-topics — list all topics (admin inbox + widget managers)
 * POST /api/admin/chat-topics — create topic { title } (ADMIN only)
 */

import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  createdResponse,
  validationError,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";
import {
  createChatTopic,
  getAllChatTopics,
} from "@/lib/services/chat-topic-service";
import { normalizeTopicTitle } from "@/lib/site/chat-topics";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminAuth(req);
    if (!admin) {
      return errorResponse(
        "لطفا وارد شوید",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }
    const topics = await getAllChatTopics();
    return successResponse(topics, "موضوعات با موفقیت دریافت شدند");
  } catch (error) {
    console.error("[GET /api/admin/chat-topics] error:", error);
    return errorResponse(
      "خطا در دریافت موضوعات",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminAuth(req);
    if (!admin || admin.role !== "ADMIN") {
      return errorResponse(
        "فقط ادمین می‌تواند موضوع اضافه کند",
        ErrorCodes.FORBIDDEN,
        undefined,
        HttpStatus.FORBIDDEN
      );
    }

    const body = await req.json().catch(() => null);
    const title = normalizeTopicTitle(body?.title);
    if (!title) {
      return validationError(
        { title: "عنوان موضوع الزامی است (حداکثر ۶۰ کاراکتر)" },
        "اطلاعات ارسالی معتبر نیست"
      );
    }

    const created = await createChatTopic(title);
    return createdResponse(created, "موضوع جدید اضافه شد");
  } catch (error) {
    console.error("[POST /api/admin/chat-topics] error:", error);
    return errorResponse(
      "خطا در ایجاد موضوع",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
