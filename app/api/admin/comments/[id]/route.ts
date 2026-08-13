/**
 * GET/PATCH/DELETE /api/admin/comments/[id]
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  successResponse,
  validationError,
} from "@/lib/api-response";
import { requireAdminUser } from "@/lib/admin/landing-cms-api";
import type { UserRoleType } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const ROLE_VALUES = new Set(["STUDENT", "PROFESSIONAL_TRADER", "INVESTOR"]);

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  const item = await prisma.comment.findUnique({ where: { id } });
  if (!item) return notFoundResponse("نظر", "نظر یافت نشد");
  return successResponse(item);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("نظر", "نظر یافت نشد");

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (typeof body.text === "string") {
      if (!body.text.trim()) {
        return validationError({ text: "متن نظر الزامی است" });
      }
      data.text = body.text.trim();
    }
    if (typeof body.userName === "string") data.userName = body.userName.trim() || null;
    if (typeof body.userAvatar === "string") data.userAvatar = body.userAvatar.trim() || null;
    if (body.userAvatar === null) data.userAvatar = null;
    if (typeof body.userCompany === "string") {
      data.userCompany = body.userCompany.trim() || null;
    }
    if (body.userRole === null || body.userRole === "") {
      data.userRole = null;
    } else if (typeof body.userRole === "string" && ROLE_VALUES.has(body.userRole)) {
      data.userRole = body.userRole as UserRoleType;
    }
    if (body.rating !== undefined && body.rating !== null) {
      const rating = Number(body.rating);
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        return validationError({ rating: "امتیاز باید بین ۱ تا ۵ باشد" });
      }
      data.rating = Math.round(rating);
    }
    if (typeof body.published === "boolean") data.published = body.published;
    if (typeof body.verified === "boolean") data.verified = body.verified;
    if (typeof body.featured === "boolean") data.featured = body.featured;

    const item = await prisma.comment.update({ where: { id }, data });
    return successResponse(item, "نظر به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating comment:", error);
    return errorResponse("خطا در به‌روزرسانی نظر", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  const { id } = await params;
  try {
    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return notFoundResponse("نظر", "نظر یافت نشد");
    await prisma.comment.delete({ where: { id } });
    return successResponse(null, "نظر حذف شد");
  } catch (error) {
    console.error("Error deleting comment:", error);
    return errorResponse("خطا در حذف نظر", ErrorCodes.DATABASE_ERROR);
  }
}
