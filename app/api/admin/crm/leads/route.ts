/**
 * Admin CRM Leads API
 * GET  /api/admin/crm/leads - لیست سرنخ‌ها با صفحه‌بندی و فیلتر
 * POST /api/admin/crm/leads - ایجاد سرنخ جدید
 *
 * Authentication: JWT Bearer token از ورود ادمین
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  paginatedResponse,
  unauthorizedResponse,
  validationError,
} from "@/lib/api-response";
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  LeadCreateSchema,
} from "@/lib/schemas/crm-lead-schema";

export async function GET(req: NextRequest) {
  try {
    const adminUser = getAdminAuthFromRequest(req);
    if (!adminUser) {
      return unauthorizedResponse("لطفا برای ادامه وارد شوید");
    }

    const searchParams = req.nextUrl.searchParams;

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const source = searchParams.get("source");

    const where: Prisma.LeadWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (status && (LEAD_STATUSES as readonly string[]).includes(status)) {
      where.status = status as Prisma.EnumLeadStatusFilter;
    }

    if (source && (LEAD_SOURCES as readonly string[]).includes(source)) {
      where.source = source as Prisma.EnumLeadSourceFilter;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
          _count: { select: { deals: true, activities: true } },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    return paginatedResponse(leads, page, limit, total);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return errorResponse("خطایی در دریافت سرنخ‌ها رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = getAdminAuthFromRequest(req);
    if (!adminUser) {
      return unauthorizedResponse("لطفا برای ادامه وارد شوید");
    }

    const body = await req.json();
    const parsed = LeadCreateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return validationError(errors, "اطلاعات وارد شده معتبر نیست");
    }

    const { firstName, lastName, phone, email, source, status, score, notes, assignedToId } =
      parsed.data;

    const lead = await prisma.lead.create({
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        phone,
        email: email || null,
        source: source ?? "OTHER",
        status: status ?? "NEW",
        score: score ?? null,
        notes: notes || null,
        assignedToId: assignedToId || null,
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    return createdResponse(lead, "سرنخ با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating lead:", error);
    return errorResponse("خطایی در ایجاد سرنخ رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}
