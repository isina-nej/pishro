/**
 * GET/PATCH /api/admin/live-chat/[id]
 * POST /api/admin/live-chat/[id] — reply
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  successResponse,
  validationError,
} from "@/lib/api-response";
import {
  AdminGuestChatMessageSchema,
  AdminGuestChatStatusSchema,
} from "@/lib/schemas/guest-chat-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = getAdminAuthFromRequest(req);
    if (!admin) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const { id } = await params;
    const conversation = await prisma.guestChatConversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!conversation) {
      return notFoundResponse("گفتگو", "گفتگو یافت نشد");
    }

    return successResponse(conversation);
  } catch (error) {
    console.error("admin live-chat get error:", error);
    return errorResponse("خطا در دریافت گفتگو", ErrorCodes.DATABASE_ERROR);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = getAdminAuthFromRequest(req);
    if (!admin) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = AdminGuestChatStatusSchema.safeParse(body);
    if (!parsed.success) {
      return validationError({ status: "وضعیت نامعتبر است" });
    }

    const existing = await prisma.guestChatConversation.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("گفتگو", "گفتگو یافت نشد");
    }

    const updated = await prisma.guestChatConversation.update({
      where: { id },
      data: {
        status: parsed.data.status,
        closedAt: parsed.data.status === "CLOSED" ? new Date() : null,
      },
    });

    return successResponse(updated, "وضعیت به‌روزرسانی شد");
  } catch (error) {
    console.error("admin live-chat patch error:", error);
    return errorResponse("خطا در به‌روزرسانی", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = getAdminAuthFromRequest(req);
    if (!admin) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = AdminGuestChatMessageSchema.safeParse(body);
    if (!parsed.success) {
      return validationError({
        body: parsed.error.issues[0]?.message || "پیام نامعتبر است",
      });
    }

    const conversation = await prisma.guestChatConversation.findUnique({
      where: { id },
    });
    if (!conversation) {
      return notFoundResponse("گفتگو", "گفتگو یافت نشد");
    }
    if (conversation.status === "CLOSED") {
      return errorResponse("گفتگو بسته است", ErrorCodes.VALIDATION_ERROR, undefined, 400);
    }

    const message = await prisma.$transaction(async (tx) => {
      const created = await tx.guestChatMessage.create({
        data: {
          conversationId: id,
          sender: "ADMIN",
          body: parsed.data.body,
          adminId: admin.id,
          adminName: admin.name || admin.email,
        },
      });
      await tx.guestChatConversation.update({
        where: { id },
        data: {
          lastMessageAt: created.createdAt,
          status: "ACTIVE",
        },
      });
      return created;
    });

    return createdResponse(message, "پاسخ ارسال شد");
  } catch (error) {
    console.error("admin live-chat reply error:", error);
    return errorResponse("خطا در ارسال پاسخ", ErrorCodes.DATABASE_ERROR);
  }
}
