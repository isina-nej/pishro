/**
 * GET/POST /api/admin/home-mini-sliders
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
import { HomeMiniSliderUpsertSchema } from "@/lib/schemas/landing-cms-schema";

export async function GET(req: NextRequest) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
    const skip = (page - 1) * limit;
    const row = searchParams.get("row");

    const where = row ? { row: parseInt(row) } : {};
    const [items, total] = await Promise.all([
      prisma.homeMiniSlider.findMany({ where, skip, take: limit, orderBy: [{ row: "asc" }, { order: "asc" }] }),
      prisma.homeMiniSlider.count({ where }),
    ]);
    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error listing home mini sliders:", error);
    return errorResponse("خطا در دریافت مینی‌اسلایدرها", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(req: NextRequest) {
  const { response } = requireAdminUser(req);
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = parseZodBody(HomeMiniSliderUpsertSchema, body);
    if (parsed.response) return parsed.response;

    const item = await prisma.homeMiniSlider.create({
      data: stripNulls(parsed.data as Record<string, unknown>) as never,
    });
    return createdResponse(item, "مینی‌اسلایدر ایجاد شد");
  } catch (error) {
    console.error("Error creating home mini slider:", error);
    return errorResponse("خطا در ایجاد مینی‌اسلایدر", ErrorCodes.DATABASE_ERROR);
  }
}
