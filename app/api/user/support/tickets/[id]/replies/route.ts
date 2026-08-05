/**
 * POST /api/user/support/tickets/[id]/replies — customer reply on a ticket
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
  notFoundResponse,
  unauthorizedResponse,
  validationError,
} from "@/lib/api-response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const { id } = await params;
    const body = await req.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";

    if (content.length < 1) {
      return validationError({ content: "متن پیام الزامی است" });
    }

    const ticket = await prisma.supportTicket.findFirst({
      where: { id, customerId: session.user.id },
      select: { id: true, status: true },
    });

    if (!ticket) {
      return notFoundResponse("Ticket", "تیکت یافت نشد");
    }

    if (ticket.status === "CLOSED") {
      return validationError(
        { status: "تیکت بسته شده است" },
        "امکان پاسخ به تیکت بسته وجود ندارد"
      );
    }

    const activity = await prisma.$transaction(async (tx) => {
      const note = await tx.activity.create({
        data: {
          type: "NOTE",
          content,
          ticketId: id,
          customerId: session.user.id,
        },
      });

      // Mark waiting on support when customer replies
      if (
        ticket.status === "WAITING_ON_CUSTOMER" ||
        ticket.status === "RESOLVED"
      ) {
        await tx.supportTicket.update({
          where: { id },
          data: { status: "OPEN" },
        });
      }

      return note;
    });

    return createdResponse(activity, "پاسخ ثبت شد");
  } catch (error) {
    console.error("Error creating ticket reply:", error);
    return errorResponse(
      "خطا در ثبت پاسخ",
      ErrorCodes.DATABASE_ERROR,
      undefined,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
