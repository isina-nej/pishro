/**
 * GET/PATCH/DELETE /api/admin/investment-plans/[id]
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  successResponse,
} from "@/lib/api-response";
import { parseZodBody, requireAdminUser, stripNulls } from "@/lib/admin/landing-cms-api";
import { InvestmentPlansUpdateSchema } from "@/lib/schemas/landing-cms-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.investmentPlans.findUnique({
    where: { id },
    include: {
      plans: { orderBy: { order: "asc" } },
      tags: { orderBy: { order: "asc" } },
    },
  });
  if (!item) return notFoundResponse("سبدها", "صفحه سبدهای سرمایه‌گذاری یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = parseZodBody(InvestmentPlansUpdateSchema, body);
    if (parsed.response) return parsed.response;

    const existing = await prisma.investmentPlans.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("سبدها", "صفحه سبدهای سرمایه‌گذاری یافت نشد");

    const item = await prisma.investmentPlans.update({
      where: { id },
      data: stripNulls(parsed.data as Record<string, unknown>),
      include: {
        plans: { orderBy: { order: "asc" } },
        tags: { orderBy: { order: "asc" } },
      },
    });
    return successResponse(item, "صفحه سبدها به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating investment plans:", error);
    return errorResponse("خطا در به‌روزرسانی سبدها", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.investmentPlans.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("سبدها", "صفحه سبدهای سرمایه‌گذاری یافت نشد");
    await prisma.investmentPlans.delete({ where: { id } });
    return successResponse(null, "صفحه سبدها حذف شد");
  } catch (error) {
    console.error("Error deleting investment plans:", error);
    return errorResponse("خطا در حذف سبدها", ErrorCodes.DATABASE_ERROR);
  }
}
