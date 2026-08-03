/**
 * GET/POST /api/admin/home-slides
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  paginatedResponse,
} from "@/lib/api-response";
import { parseZodBody, requireAdminUser, stripNulls } from "@/lib/admin/landing-cms-api";
import { HomeSlideUpsertSchema } from "@/lib/schemas/landing-cms-schema";

export async function GET(req: NextRequest) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.homeSlide.findMany({ skip, take: limit, orderBy: { order: "asc" } }),
      prisma.homeSlide.count(),
    ]);
    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error listing home slides:", error);
    return errorResponse("خطا در دریافت اسلایدها", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(req: NextRequest) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = parseZodBody(HomeSlideUpsertSchema, body);
    if (parsed.response) return parsed.response;

    const item = await prisma.homeSlide.create({
      data: stripNulls(parsed.data as Record<string, unknown>) as never,
    });
    return createdResponse(item, "اسلاید ایجاد شد");
  } catch (error) {
    console.error("Error creating home slide:", error);
    return errorResponse("خطا در ایجاد اسلاید", ErrorCodes.DATABASE_ERROR);
  }
}
