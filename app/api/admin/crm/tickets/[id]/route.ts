/**
 * Admin CRM Support Ticket Detail API
 * GET /api/admin/crm/tickets/[id] - Ticket detail incl. activities, customer, assignee
 * PATCH /api/admin/crm/tickets/[id] - Update status/priority/assignedToId
 * DELETE /api/admin/crm/tickets/[id] - Delete ticket
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  successResponse,
  validationError,
} from "@/lib/api-response";
import { TicketUpdateSchema } from "@/lib/schemas/crm-ticket-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

const ticketDetailInclude = {
  customer: {
    select: { id: true, firstName: true, lastName: true, phone: true, email: true },
  },
  assignedTo: { select: { id: true, name: true, email: true } },
  activities: {
    orderBy: { createdAt: "asc" as const },
    include: { admin: { select: { id: true, name: true, email: true } } },
  },
} satisfies Prisma.SupportTicketInclude;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("لطفا وارد حساب کاربری شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const { id } = await params;
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: ticketDetailInclude,
    });

    if (!ticket) {
      return notFoundResponse("Ticket", "تیکت یافت نشد");
    }

    return successResponse(ticket, "تیکت با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching CRM ticket:", error);
    return errorResponse("خطا در دریافت تیکت", ErrorCodes.DATABASE_ERROR);
  }
}

export async function PATCH(
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

    const parsed = TicketUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors);
    }

    const { subject, description, status, priority, assignedToId } = parsed.data;

    const data: Prisma.SupportTicketUpdateInput = {};

    if (subject !== undefined) data.subject = subject;
    if (description !== undefined) data.description = description;
    if (priority !== undefined) data.priority = priority;
    if (assignedToId !== undefined) {
      data.assignedTo = assignedToId ? { connect: { id: assignedToId } } : { disconnect: true };
    }

    if (status !== undefined) {
      data.status = status;
      if (status === "RESOLVED") {
        data.resolvedAt = new Date();
      } else {
        data.resolvedAt = null;
      }
    }

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data,
      include: ticketDetailInclude,
    });

    return successResponse(ticket, "تیکت با موفقیت به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating CRM ticket:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Ticket", "تیکت یافت نشد");
    }
    return errorResponse("خطا در به‌روزرسانی تیکت", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("لطفا وارد حساب کاربری شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const { id } = await params;

    await prisma.supportTicket.delete({ where: { id } });

    return successResponse({ id }, "تیکت با موفقیت حذف شد");
  } catch (error) {
    console.error("Error deleting CRM ticket:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Ticket", "تیکت یافت نشد");
    }
    return errorResponse("خطا در حذف تیکت", ErrorCodes.DATABASE_ERROR);
  }
}
