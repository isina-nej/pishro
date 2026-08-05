/**
 * GET /api/user/support/tickets/[id] — ticket detail + conversation
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const { id } = await params;
    const ticket = await prisma.supportTicket.findFirst({
      where: { id, customerId: session.user.id },
      include: {
        activities: {
          orderBy: { createdAt: "asc" },
          include: {
            admin: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!ticket) {
      return notFoundResponse("Ticket", "تیکت یافت نشد");
    }

    return successResponse(ticket, "جزئیات تیکت");
  } catch (error) {
    console.error("Error fetching user ticket:", error);
    return errorResponse("خطا در دریافت تیکت", ErrorCodes.DATABASE_ERROR);
  }
}
