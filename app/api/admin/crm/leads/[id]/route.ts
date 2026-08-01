/**
 * Admin CRM Lead Detail API
 * GET    /api/admin/crm/leads/[id] - جزئیات سرنخ به همراه فعالیت‌ها و مسئول
 * PATCH  /api/admin/crm/leads/[id] - بروزرسانی سرنخ
 * DELETE /api/admin/crm/leads/[id] - حذف سرنخ
 *
 * Authentication: JWT Bearer token از ورود ادمین
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  ErrorCodes,
  noContentResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationError,
} from "@/lib/api-response";
import { LeadUpdateSchema } from "@/lib/schemas/crm-lead-schema";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const adminUser = getAdminAuthFromRequest(req);
    if (!adminUser) {
      return unauthorizedResponse("لطفا برای ادامه وارد شوید");
    }

    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        convertedUser: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
        deals: {
          select: { id: true, title: true, amount: true, stageId: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          include: {
            admin: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!lead) {
      return notFoundResponse("سرنخ", "سرنخ مورد نظر یافت نشد");
    }

    return successResponse(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    return errorResponse("خطایی در دریافت اطلاعات سرنخ رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const adminUser = getAdminAuthFromRequest(req);
    if (!adminUser) {
      return unauthorizedResponse("لطفا برای ادامه وارد شوید");
    }

    const { id } = await params;

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("سرنخ", "سرنخ مورد نظر یافت نشد");
    }

    const body = await req.json();
    const parsed = LeadUpdateSchema.safeParse(body);
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

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(firstName !== undefined && { firstName: firstName || null }),
        ...(lastName !== undefined && { lastName: lastName || null }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email: email || null }),
        ...(source !== undefined && { source }),
        ...(status !== undefined && { status }),
        ...(score !== undefined && { score }),
        ...(notes !== undefined && { notes: notes || null }),
        ...(assignedToId !== undefined && { assignedToId: assignedToId || null }),
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    // اگر وضعیت تغییر کرد یک رکورد فعالیت سیستمی برای پیگیری تاریخچه ثبت می‌شود
    if (status !== undefined && status !== existing.status) {
      await prisma.activity.create({
        data: {
          type: "STATUS_CHANGE",
          content: `وضعیت سرنخ از «${existing.status}» به «${status}» تغییر یافت`,
          leadId: id,
          adminId: adminUser.id,
        },
      });
    }

    return successResponse(lead, "سرنخ با موفقیت بروزرسانی شد");
  } catch (error) {
    console.error("Error updating lead:", error);
    return errorResponse("خطایی در بروزرسانی سرنخ رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const adminUser = getAdminAuthFromRequest(req);
    if (!adminUser) {
      return unauthorizedResponse("لطفا برای ادامه وارد شوید");
    }

    const { id } = await params;

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("سرنخ", "سرنخ مورد نظر یافت نشد");
    }

    await prisma.lead.delete({ where: { id } });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting lead:", error);
    return errorResponse("خطایی در حذف سرنخ رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}
