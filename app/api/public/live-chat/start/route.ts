import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  validationError,
} from "@/lib/api-response";
import { GuestChatStartSchema } from "@/lib/schemas/guest-chat-schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GuestChatStartSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      return validationError(fieldErrors);
    }

    const { firstName, lastName, phone, topic, message } = parsed.data;
    const visitorToken = randomBytes(24).toString("hex");
    const now = new Date();

    const conversation = await prisma.guestChatConversation.create({
      data: {
        firstName,
        lastName,
        phone,
        topic: topic || null,
        visitorToken,
        status: "OPEN",
        lastMessageAt: now,
        messages: message
          ? {
              create: {
                sender: "VISITOR",
                body: message,
              },
            }
          : undefined,
      },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    return createdResponse(
      {
        id: conversation.id,
        visitorToken: conversation.visitorToken,
        firstName: conversation.firstName,
        lastName: conversation.lastName,
        phone: conversation.phone,
        topic: conversation.topic,
        status: conversation.status,
        messages: conversation.messages,
      },
      "گفتگو شروع شد"
    );
  } catch (error) {
    console.error("live-chat start error:", error);
    return errorResponse("خطا در شروع گفتگو", ErrorCodes.DATABASE_ERROR);
  }
}
