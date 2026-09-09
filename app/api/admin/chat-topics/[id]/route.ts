/**
 * PATCH /api/admin/chat-topics/[id] — rename / publish-toggle (ADMIN only)
 * DELETE /api/admin/chat-topics/[id] — remove topic (ADMIN only)
 */

import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  errorResponse,
  successResponse,
  validationError,
  notFoundResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";
import {
  deleteChatTopic,
  updateChatTopic,
} from "@/lib/services/chat-topic-service";
import { normalizeTopicTitle } from "@/lib/site/chat-topics";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = await getAdminAuth(req);
    if (!admin || admin.role !== "ADMIN") {
      return errorResponse(
        "فقط ادمین می‌تواند موضوعات را ویرایش کند",
        ErrorCodes.FORBIDDEN,
        undefined,
        HttpStatus.FORBIDDEN
      );
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return validationError({ _: "بدنه درخواست نامعتبر است" });
    }

    const patch: { title?: string; published?: boolean } = {};
    if ("title" in body) {
      const title = normalizeTopicTitle(
        (body as Record<string, unknown>).title
      );
      if (!title) {
        return validationError(
          { title: "عنوان موضوع الزامی است (حداکثر ۶۰ کاراکتر)" },
          "اطلاعات ارسالی معتبر نیست"
        );
      }
      patch.title = title;
    }
    if ("published" in body) {
      const published = (body as Record<string, unknown>).published;
      if (typeof published !== "boolean") {
        return validationError(
          { published: "وضعیت انتشار باید true یا false باشد" },
          "اطلاعات ارسالی معتبر نیست"
        );
      }
      patch.published = published;
    }
    if (Object.keys(patch).length === 0) {
      return validationError({ _: "فیلدی برای به‌روزرسانی ارسال نشده است" });
    }

    const updated = await updateChatTopic(id, patch);
    if (!updated) {
      return notFoundResponse("موضوع", "موضوع یافت نشد");
    }
    return successResponse(updated, "موضوع به‌روزرسانی شد");
  } catch (error) {
    console.error("[PATCH /api/admin/chat-topics/:id] error:", error);
    return errorResponse(
      "خطا در به‌روزرسانی موضوع",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = await getAdminAuth(req);
    if (!admin || admin.role !== "ADMIN") {
      return errorResponse(
        "فقط ادمین می‌تواند موضوع حذف کند",
        ErrorCodes.FORBIDDEN,
        undefined,
        HttpStatus.FORBIDDEN
      );
    }

    const { id } = await params;
    const ok = await deleteChatTopic(id);
    if (!ok) {
      return notFoundResponse("موضوع", "موضوع یافت نشد");
    }
    return successResponse({ id }, "موضوع حذف شد");
  } catch (error) {
    console.error("[DELETE /api/admin/chat-topics/:id] error:", error);
    return errorResponse("خطا در حذف موضوع", ErrorCodes.DATABASE_ERROR);
  }
}
