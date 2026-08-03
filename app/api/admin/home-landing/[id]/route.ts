/**
 * GET/PATCH/DELETE /api/admin/home-landing/[id]
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
import { HomeLandingUpdateSchema } from "@/lib/schemas/landing-cms-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.homeLanding.findUnique({ where: { id } });
  if (!item) return notFoundResponse("لندینگ", "صفحه لندینگ یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = parseZodBody(HomeLandingUpdateSchema, body);
    if (parsed.response) return parsed.response;

    const existing = await prisma.homeLanding.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("لندینگ", "صفحه لندینگ یافت نشد");

    const item = await prisma.homeLanding.update({
      where: { id },
      data: stripNulls(parsed.data as Record<string, unknown>),
    });
    return successResponse(item, "صفحه لندینگ به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating home landing:", error);
    return errorResponse("خطا در به‌روزرسانی لندینگ", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.homeLanding.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("لندینگ", "صفحه لندینگ یافت نشد");
    await prisma.homeLanding.delete({ where: { id } });
    return successResponse(null, "صفحه لندینگ حذف شد");
  } catch (error) {
    console.error("Error deleting home landing:", error);
    return errorResponse("خطا در حذف لندینگ", ErrorCodes.DATABASE_ERROR);
  }
}
