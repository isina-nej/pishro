/**
 * GET/PATCH/DELETE /api/admin/home-slides/[id]
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
import { HomeSlideUpdateSchema } from "@/lib/schemas/landing-cms-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.homeSlide.findUnique({ where: { id } });
  if (!item) return notFoundResponse("اسلاید", "اسلاید یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = parseZodBody(HomeSlideUpdateSchema, body);
    if (parsed.response) return parsed.response;

    const existing = await prisma.homeSlide.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("اسلاید", "اسلاید یافت نشد");

    const item = await prisma.homeSlide.update({
      where: { id },
      data: stripNulls(parsed.data as Record<string, unknown>),
    });
    return successResponse(item, "اسلاید به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating home-slides:", error);
    return errorResponse("خطا در به‌روزرسانی اسلاید", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.homeSlide.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("اسلاید", "اسلاید یافت نشد");
    await prisma.homeSlide.delete({ where: { id } });
    return successResponse(null, "اسلاید حذف شد");
  } catch (error) {
    console.error("Error deleting home-slides:", error);
    return errorResponse("خطا در حذف اسلاید", ErrorCodes.DATABASE_ERROR);
  }
}
