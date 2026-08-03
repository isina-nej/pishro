/**
 * GET/PATCH/DELETE /api/admin/about-page/[id]
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
import { AboutPageUpdateSchema } from "@/lib/schemas/landing-cms-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.aboutPage.findUnique({
    where: { id },
    include: {
      resumeItems: { orderBy: { order: "asc" } },
      teamMembers: { orderBy: { order: "asc" } },
      certificates: { orderBy: { order: "asc" } },
    },
  });
  if (!item) return notFoundResponse("درباره ما", "صفحه درباره ما یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = parseZodBody(AboutPageUpdateSchema, body);
    if (parsed.response) return parsed.response;

    const existing = await prisma.aboutPage.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("درباره ما", "صفحه درباره ما یافت نشد");

    const item = await prisma.aboutPage.update({
      where: { id },
      data: stripNulls(parsed.data as Record<string, unknown>),
      include: {
        resumeItems: { orderBy: { order: "asc" } },
        teamMembers: { orderBy: { order: "asc" } },
        certificates: { orderBy: { order: "asc" } },
      },
    });
    return successResponse(item, "صفحه درباره ما به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating about page:", error);
    return errorResponse("خطا در به‌روزرسانی درباره ما", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.aboutPage.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("درباره ما", "صفحه درباره ما یافت نشد");
    await prisma.aboutPage.delete({ where: { id } });
    return successResponse(null, "صفحه درباره ما حذف شد");
  } catch (error) {
    console.error("Error deleting about page:", error);
    return errorResponse("خطا در حذف درباره ما", ErrorCodes.DATABASE_ERROR);
  }
}
