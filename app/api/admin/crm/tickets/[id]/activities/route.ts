/**
 * Admin CRM Ticket Activities API
 * POST /api/admin/crm/tickets/[id]/activities - Add an internal note/activity to a ticket
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  validationError,
} from "@/lib/api-response";
import { TicketActivityCreateSchema } from "@/lib/schemas/crm-ticket-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("لطفا وارد حساب کاربری شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const { id } = await params;
    const body = await req.json();

    const parsed = TicketActivityCreateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors);
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!ticket) {
      return notFoundResponse("Ticket", "تیکت یافت نشد");
    }

    const activity = await prisma.activity.create({
      data: {
        type: parsed.data.type ?? "NOTE",
        content: parsed.data.content,
        ticketId: id,
        adminId: adminUser.id,
      },
      include: {
        admin: { select: { id: true, name: true, email: true } },
      },
    });

    return createdResponse(activity, "یادداشت با موفقیت ثبت شد");
  } catch (error) {
    console.error("Error creating ticket activity:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Ticket", "تیکت یافت نشد");
    }
    return errorResponse("خطا در ثبت یادداشت", ErrorCodes.DATABASE_ERROR);
  }
}
