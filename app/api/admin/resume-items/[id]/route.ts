/**
 * GET/PATCH/DELETE /api/admin/resume-items/[id]
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
import { ResumeItemUpdateSchema } from "@/lib/schemas/landing-cms-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.resumeItem.findUnique({ where: { id } });
  if (!item) return notFoundResponse("آیتم رزومه", "آیتم رزومه یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = parseZodBody(ResumeItemUpdateSchema, body);
    if (parsed.response) return parsed.response;

    const existing = await prisma.resumeItem.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("آیتم رزومه", "آیتم رزومه یافت نشد");

    const item = await prisma.resumeItem.update({
      where: { id },
      data: stripNulls(parsed.data as Record<string, unknown>),
    });
    return successResponse(item, "آیتم به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating resume-items:", error);
    return errorResponse("خطا در به‌روزرسانی آیتم", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.resumeItem.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("آیتم رزومه", "آیتم رزومه یافت نشد");
    await prisma.resumeItem.delete({ where: { id } });
    return successResponse(null, "آیتم حذف شد");
  } catch (error) {
    console.error("Error deleting resume-items:", error);
    return errorResponse("خطا در حذف آیتم", ErrorCodes.DATABASE_ERROR);
  }
}
