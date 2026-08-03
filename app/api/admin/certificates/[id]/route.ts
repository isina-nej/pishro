/**
 * GET/PATCH/DELETE /api/admin/certificates/[id]
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
import { CertificateUpdateSchema } from "@/lib/schemas/landing-cms-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.certificate.findUnique({ where: { id } });
  if (!item) return notFoundResponse("گواهی", "گواهی یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = parseZodBody(CertificateUpdateSchema, body);
    if (parsed.response) return parsed.response;

    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("گواهی", "گواهی یافت نشد");

    const item = await prisma.certificate.update({
      where: { id },
      data: stripNulls(parsed.data as Record<string, unknown>),
    });
    return successResponse(item, "گواهی به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating certificates:", error);
    return errorResponse("خطا در به‌روزرسانی گواهی", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("گواهی", "گواهی یافت نشد");
    await prisma.certificate.delete({ where: { id } });
    return successResponse(null, "گواهی حذف شد");
  } catch (error) {
    console.error("Error deleting certificates:", error);
    return errorResponse("خطا در حذف گواهی", ErrorCodes.DATABASE_ERROR);
  }
}
