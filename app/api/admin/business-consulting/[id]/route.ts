/**
 * GET/PATCH/DELETE /api/admin/business-consulting/[id]
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
import { BusinessConsultingUpdateSchema } from "@/lib/schemas/landing-cms-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.businessConsulting.findUnique({ where: { id } });
  if (!item) return notFoundResponse("مشاوره", "صفحه مشاوره یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = parseZodBody(BusinessConsultingUpdateSchema, body);
    if (parsed.response) return parsed.response;

    const existing = await prisma.businessConsulting.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("مشاوره", "صفحه مشاوره یافت نشد");

    const item = await prisma.businessConsulting.update({
      where: { id },
      data: stripNulls(parsed.data as Record<string, unknown>),
    });
    return successResponse(item, "صفحه مشاوره به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating business consulting:", error);
    return errorResponse("خطا در به‌روزرسانی مشاوره", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.businessConsulting.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("مشاوره", "صفحه مشاوره یافت نشد");
    await prisma.businessConsulting.delete({ where: { id } });
    return successResponse(null, "صفحه مشاوره حذف شد");
  } catch (error) {
    console.error("Error deleting business consulting:", error);
    return errorResponse("خطا در حذف مشاوره", ErrorCodes.DATABASE_ERROR);
  }
}
