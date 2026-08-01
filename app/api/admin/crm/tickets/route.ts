/**
 * Admin CRM Support Tickets API
 * GET /api/admin/crm/tickets - List tickets with pagination and filters
 * POST /api/admin/crm/tickets - Create a new ticket
 *
 * Authentication: Admin JWT (Bearer token or admin cookie)
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  paginatedResponse,
  validationError,
} from "@/lib/api-response";
import { TicketCreateSchema } from "@/lib/schemas/crm-ticket-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function GET(req: NextRequest) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("لطفا وارد حساب کاربری شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const searchParams = req.nextUrl.searchParams;

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const assignedToMe = searchParams.get("assignedToMe") === "true";

    const where: Prisma.SupportTicketWhereInput = {};

    if (search) {
      where.subject = { contains: search };
    }

    if (
      status &&
      ["OPEN", "IN_PROGRESS", "WAITING_ON_CUSTOMER", "RESOLVED", "CLOSED"].includes(status)
    ) {
      where.status = status as Prisma.EnumTicketStatusFilter;
    }

    if (priority && ["LOW", "NORMAL", "HIGH", "URGENT"].includes(priority)) {
      where.priority = priority as Prisma.EnumTicketPriorityFilter;
    }

    if (assignedToMe) {
      where.assignedToId = adminUser.id;
    }

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, phone: true, email: true },
          },
          assignedTo: { select: { id: true, name: true, email: true } },
          _count: { select: { activities: true } },
        },
      }),
      prisma.supportTicket.count({ where }),
    ]);

    return paginatedResponse(tickets, page, limit, total);
  } catch (error) {
    console.error("Error fetching CRM tickets:", error);
    return errorResponse("خطا در دریافت تیکت‌ها", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("لطفا وارد حساب کاربری شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const body = await req.json();
    const parsed = TicketCreateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors);
    }

    const { subject, description, priority, status, customerId, customerPhone, assignedToId } =
      parsed.data;

    // اگر شناسه مشتری داده نشده ولی شماره تلفن داده شده، تلاش برای یافتن مشتری از روی شماره تلفن
    let resolvedCustomerId = customerId || null;
    let finalDescription = description;

    if (!resolvedCustomerId && customerPhone) {
      const matchedUser = await prisma.user.findUnique({
        where: { phone: customerPhone },
        select: { id: true },
      });

      if (matchedUser) {
        resolvedCustomerId = matchedUser.id;
      } else {
        // مشتری در سیستم یافت نشد؛ شماره تلفن به عنوان یادداشت در توضیحات ذخیره می‌شود
        finalDescription = `${description}\n\n[شماره تماس مشتری: ${customerPhone}]`;
      }
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        subject,
        description: finalDescription,
        priority: priority ?? "NORMAL",
        status: status ?? "OPEN",
        customerId: resolvedCustomerId,
        assignedToId: assignedToId || null,
      },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, phone: true, email: true },
        },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    return createdResponse(ticket, "تیکت با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating CRM ticket:", error);
    return errorResponse("خطا در ایجاد تیکت", ErrorCodes.DATABASE_ERROR);
  }
}
