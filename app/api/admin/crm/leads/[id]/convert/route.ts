/**
 * Admin CRM Lead Convert-to-Deal API
 * POST /api/admin/crm/leads/[id]/convert
 *
 * سرنخ را به یک فرصت فروش (Deal) تبدیل می‌کند: یک Deal جدید در اولین
 * مرحله‌ی pipeline (بر اساس order) ایجاد می‌شود و وضعیت سرنخ CONVERTED می‌شود.
 * مراحل pipeline توسط یک تیم موازی دیگر مدیریت می‌شود؛ این endpoint فقط
 * اولین مرحله را می‌خواند (findFirst) و هرگز آن را ایجاد/ویرایش نمی‌کند.
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
import { LeadConvertSchema } from "@/lib/schemas/crm-lead-schema";

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

    let body: unknown = {};
    try {
      body = await req.json();
    } catch {
      // بدنه خالی هم مجاز است (تبدیل با مقادیر پیش‌فرض)
    }

    const parsed = LeadConvertSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return validationError(errors, "اطلاعات وارد شده معتبر نیست");
    }

    const firstStage = await prisma.pipelineStage.findFirst({
      orderBy: { order: "asc" },
    });

    if (!firstStage) {
      return errorResponse(
        "هیچ مرحله‌ای برای قیف فروش (Pipeline) تعریف نشده است. لطفا ابتدا یک مرحله ایجاد کنید",
        ErrorCodes.VALIDATION_ERROR,
        undefined,
        422
      );
    }

    const leadName = [lead.firstName, lead.lastName].filter(Boolean).join(" ").trim();
    const dealTitle = parsed.data.title?.trim() || `فرصت فروش ${leadName || lead.phone}`;

    let customerId: string | null = null;
    if (parsed.data.linkExistingCustomer) {
      const existingCustomer = await prisma.user.findUnique({
        where: { phone: lead.phone },
        select: { id: true },
      });
      customerId = existingCustomer?.id ?? null;
    }

    const [deal] = await prisma.$transaction([
      prisma.deal.create({
        data: {
          title: dealTitle,
          stageId: firstStage.id,
          leadId: lead.id,
          customerId,
          ownerAdminId: adminUser.id,
        },
      }),
      prisma.lead.update({
        where: { id: lead.id },
        data: { status: "CONVERTED" },
      }),
      prisma.activity.create({
        data: {
          type: "SYSTEM",
          content: `سرنخ به فرصت فروش «${dealTitle}» تبدیل شد`,
          leadId: lead.id,
          adminId: adminUser.id,
        },
      }),
    ]);

    return createdResponse(deal, "سرنخ با موفقیت به فرصت فروش تبدیل شد");
  } catch (error) {
    console.error("Error converting lead:", error);
    return errorResponse("خطایی در تبدیل سرنخ به فرصت فروش رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}
