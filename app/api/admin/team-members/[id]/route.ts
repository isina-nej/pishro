/**
 * GET/PATCH/DELETE /api/admin/team-members/[id]
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
import { TeamMemberUpdateSchema } from "@/lib/schemas/landing-cms-schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.teamMember.findUnique({ where: { id } });
  if (!item) return notFoundResponse("عضو تیم", "عضو تیم یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = parseZodBody(TeamMemberUpdateSchema, body);
    if (parsed.response) return parsed.response;

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("عضو تیم", "عضو تیم یافت نشد");

    const item = await prisma.teamMember.update({
      where: { id },
      data: stripNulls(parsed.data as Record<string, unknown>),
    });
    return successResponse(item, "عضو به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating team-members:", error);
    return errorResponse("خطا در به‌روزرسانی عضو", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("عضو تیم", "عضو تیم یافت نشد");
    await prisma.teamMember.delete({ where: { id } });
    return successResponse(null, "عضو حذف شد");
  } catch (error) {
    console.error("Error deleting team-members:", error);
    return errorResponse("خطا در حذف عضو", ErrorCodes.DATABASE_ERROR);
  }
}
