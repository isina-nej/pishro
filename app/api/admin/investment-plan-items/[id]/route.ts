/**
 * GET/PATCH/DELETE /api/admin/investment-plan-items/[id]
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
import { InvestmentPlanItemUpdateSchema } from "@/lib/schemas/landing-cms-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.investmentPlan.findUnique({ where: { id } });
  if (!item) return notFoundResponse("نوع سبد", "نوع سبد یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = parseZodBody(InvestmentPlanItemUpdateSchema, body);
    if (parsed.response) return parsed.response;

    const existing = await prisma.investmentPlan.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("نوع سبد", "نوع سبد یافت نشد");

    const item = await prisma.investmentPlan.update({
      where: { id },
      data: stripNulls(parsed.data as Record<string, unknown>),
    });
    return successResponse(item, "نوع سبد به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating investment-plan-items:", error);
    return errorResponse("خطا در به‌روزرسانی نوع سبد", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.investmentPlan.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("نوع سبد", "نوع سبد یافت نشد");
    await prisma.investmentPlan.delete({ where: { id } });
    return successResponse(null, "نوع سبد حذف شد");
  } catch (error) {
    console.error("Error deleting investment-plan-items:", error);
    return errorResponse("خطا در حذف نوع سبد", ErrorCodes.DATABASE_ERROR);
  }
}
