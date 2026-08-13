/**
 * Customer support tickets
 * GET  /api/user/support/tickets — list my tickets
 * POST /api/user/support/tickets — create a ticket
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
  paginatedResponse,
  unauthorizedResponse,
  validationError,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(req.nextUrl.searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const where = { customerId: session.user.id };

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { activities: true } },
        },
      }),
      prisma.supportTicket.count({ where }),
    ]);

    return paginatedResponse(tickets, page, limit, total);
  } catch (error) {
    console.error("Error listing user tickets:", error);
    return errorResponse("خطا در دریافت تیکت‌ها", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const body = await req.json();
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const priority =
      typeof body.priority === "string" &&
      ["LOW", "NORMAL", "HIGH", "URGENT"].includes(body.priority)
        ? body.priority
        : "NORMAL";

    if (subject.length < 3) {
      return validationError(
        { subject: "موضوع حداقل ۳ کاراکتر باشد" },
        "موضوع تیکت معتبر نیست"
      );
    }
    if (description.length < 5) {
      return validationError(
        { description: "توضیحات حداقل ۵ کاراکتر باشد" },
        "توضیحات تیکت معتبر نیست"
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        subject: subject.slice(0, 200),
        description,
        priority: priority as "LOW" | "NORMAL" | "HIGH" | "URGENT",
        status: "OPEN",
        customerId: session.user.id,
      },
    });

    return createdResponse(ticket, "تیکت با موفقیت ثبت شد");
  } catch (error) {
    console.error("Error creating user ticket:", error);
    return errorResponse(
      "خطا در ثبت تیکت",
      ErrorCodes.DATABASE_ERROR,
      undefined,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
