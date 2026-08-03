/**
 * GET/PATCH/DELETE /api/admin/mobile-scroller-steps/[id]
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
import { MobileScrollerStepUpdateSchema } from "@/lib/schemas/landing-cms-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.mobileScrollerStep.findUnique({ where: { id } });
  if (!item) return notFoundResponse("قدم موبایل", "قدم موبایل یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = parseZodBody(MobileScrollerStepUpdateSchema, body);
    if (parsed.response) return parsed.response;

    const existing = await prisma.mobileScrollerStep.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("قدم موبایل", "قدم موبایل یافت نشد");

    const item = await prisma.mobileScrollerStep.update({
      where: { id },
      data: stripNulls(parsed.data as Record<string, unknown>),
    });
    return successResponse(item, "قدم به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating mobile-scroller-steps:", error);
    return errorResponse("خطا در به‌روزرسانی قدم", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.mobileScrollerStep.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("قدم موبایل", "قدم موبایل یافت نشد");
    await prisma.mobileScrollerStep.delete({ where: { id } });
    return successResponse(null, "قدم حذف شد");
  } catch (error) {
    console.error("Error deleting mobile-scroller-steps:", error);
    return errorResponse("خطا در حذف قدم", ErrorCodes.DATABASE_ERROR);
  }
}
