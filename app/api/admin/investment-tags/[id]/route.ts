/**
 * GET/PATCH/DELETE /api/admin/investment-tags/[id]
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
import { InvestmentTagUpdateSchema } from "@/lib/schemas/landing-cms-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.investmentTag.findUnique({ where: { id } });
  if (!item) return notFoundResponse("تگ سرمایه‌گذاری", "تگ سرمایه‌گذاری یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = parseZodBody(InvestmentTagUpdateSchema, body);
    if (parsed.response) return parsed.response;

    const existing = await prisma.investmentTag.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("تگ سرمایه‌گذاری", "تگ سرمایه‌گذاری یافت نشد");

    const item = await prisma.investmentTag.update({
      where: { id },
      data: stripNulls(parsed.data as Record<string, unknown>),
    });
    return successResponse(item, "تگ به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating investment-tags:", error);
    return errorResponse("خطا در به‌روزرسانی تگ", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.investmentTag.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("تگ سرمایه‌گذاری", "تگ سرمایه‌گذاری یافت نشد");
    await prisma.investmentTag.delete({ where: { id } });
    return successResponse(null, "تگ حذف شد");
  } catch (error) {
    console.error("Error deleting investment-tags:", error);
    return errorResponse("خطا در حذف تگ", ErrorCodes.DATABASE_ERROR);
  }
}
