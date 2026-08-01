/**
 * Admin CRM Lead Activities API
 * POST /api/admin/crm/leads/[id]/activities - ثبت یادداشت/فعالیت جدید برای سرنخ
 *
 * Authentication: JWT Bearer token از ورود ادمین
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  unauthorizedResponse,
  validationError,
} from "@/lib/api-response";
import { LeadActivityCreateSchema } from "@/lib/schemas/crm-lead-schema";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const adminUser = getAdminAuthFromRequest(req);
    if (!adminUser) {
      return unauthorizedResponse("لطفا برای ادامه وارد شوید");
    }

    const { id } = await params;

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return notFoundResponse("سرنخ", "سرنخ مورد نظر یافت نشد");
    }

    const body = await req.json();
    const parsed = LeadActivityCreateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return validationError(errors, "اطلاعات وارد شده معتبر نیست");
    }

    const activity = await prisma.activity.create({
      data: {
        type: parsed.data.type ?? "NOTE",
        content: parsed.data.content,
        leadId: id,
        adminId: adminUser.id,
      },
      include: {
        admin: { select: { id: true, name: true } },
      },
    });

    return createdResponse(activity, "فعالیت با موفقیت ثبت شد");
  } catch (error) {
    console.error("Error creating lead activity:", error);
    return errorResponse("خطایی در ثبت فعالیت رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}
