import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  successResponse,
  validationError,
} from "@/lib/api-response";
import { GuestChatMessageSchema } from "@/lib/schemas/guest-chat-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function loadConversation(id: string, visitorToken: string) {
  return prisma.guestChatConversation.findFirst({
    where: { id, visitorToken },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const token = req.nextUrl.searchParams.get("token") || "";
    if (!token) {
      return validationError({ token: "توکن الزامی است" });
    }

    const conversation = await loadConversation(id, token);
    if (!conversation) {
      return notFoundResponse("گفتگو", "گفتگو یافت نشد");
    }

    return successResponse({
      id: conversation.id,
      firstName: conversation.firstName,
      lastName: conversation.lastName,
      phone: conversation.phone,
      topic: conversation.topic,
      status: conversation.status,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error("live-chat get error:", error);
    return errorResponse("خطا در دریافت گفتگو", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = GuestChatMessageSchema.safeParse(body);
    if (!parsed.success) {
      return validationError({
        body: parsed.error.issues[0]?.message || "پیام نامعتبر است",
      });
    }

    const conversation = await prisma.guestChatConversation.findFirst({
      where: { id, visitorToken: parsed.data.visitorToken },
    });
    if (!conversation) {
      return notFoundResponse("گفتگو", "گفتگو یافت نشد");
    }
    if (conversation.status === "CLOSED") {
      return errorResponse("این گفتگو بسته شده است", ErrorCodes.VALIDATION_ERROR, undefined, 400);
    }

    const message = await prisma.$transaction(async (tx) => {
      const created = await tx.guestChatMessage.create({
        data: {
          conversationId: id,
          sender: "VISITOR",
          body: parsed.data.body,
        },
      });
      await tx.guestChatConversation.update({
        where: { id },
        data: {
          lastMessageAt: created.createdAt,
          status: conversation.status === "OPEN" ? "ACTIVE" : conversation.status,
        },
      });
      return created;
    });

    return createdResponse(message, "پیام ارسال شد");
  } catch (error) {
    console.error("live-chat message error:", error);
    return errorResponse("خطا در ارسال پیام", ErrorCodes.DATABASE_ERROR);
  }
}
