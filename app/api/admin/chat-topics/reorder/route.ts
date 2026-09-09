/**
 * POST /api/admin/chat-topics/reorder — persist drag-and-drop order (ADMIN only)
 * Body: { ids: string[] } — full ordered id list
 */

import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  validationError,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";
import { reorderChatTopics } from "@/lib/services/chat-topic-service";
import { validateTopicIdsInput } from "@/lib/site/chat-topics";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminAuth(req);
    if (!admin || admin.role !== "ADMIN") {
      return errorResponse(
        "فقط ادمین می‌تواند ترتیب موضوعات را تغییر دهد",
        ErrorCodes.FORBIDDEN,
        undefined,
        HttpStatus.FORBIDDEN
      );
    }

    const body = await req.json().catch(() => null);
    const ids = validateTopicIdsInput(body?.ids);
    if (!ids) {
      return validationError(
        { ids: "لیست مرتب شناسه‌ها معتبر نیست" },
        "اطلاعات ارسالی معتبر نیست"
      );
    }

    const topics = await reorderChatTopics(ids);
    return successResponse(topics, "ترتیب موضوعات ذخیره شد");
  } catch (error) {
    console.error("[POST /api/admin/chat-topics/reorder] error:", error);
    return errorResponse(
      "خطا در ذخیره ترتیب",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
