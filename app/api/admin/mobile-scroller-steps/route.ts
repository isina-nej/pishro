/**
 * Admin Mobile Scroller Steps Management API
 * GET /api/admin/mobile-scroller-steps - List all mobile scroller steps
 * POST /api/admin/mobile-scroller-steps - Create a new mobile scroller step
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";
import { normalizeImageUrl } from "@/lib/utils";
import {
  parseZodBody,
  requireAdminUser,
  stripNulls,
} from "@/lib/admin/landing-cms-api";
import { MobileScrollerStepUpsertSchema } from "@/lib/schemas/landing-cms-schema";

export async function GET(req: NextRequest) {
  try {
    const { response } = requireAdminUser(req);
    if (response) return response;

    const searchParams = req.nextUrl.searchParams;

    // Pagination — allow large lists so admins can manage many steps
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(500, parseInt(searchParams.get("limit") || "100"));
    const skip = (page - 1) * limit;

    const published = searchParams.get("published");
    const where: Prisma.MobileScrollerStepWhereInput = {};

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    const [items, total] = await Promise.all([
      prisma.mobileScrollerStep.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: "asc" }, { stepNumber: "asc" }],
      }),
      prisma.mobileScrollerStep.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching mobile scroller steps:", error);
    return errorResponse(
      "خطا در دریافت مراحل اسکرولر موبایل",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { response } = requireAdminUser(req);
    if (response) return response;

    const body = await req.json();
    const parsed = parseZodBody(MobileScrollerStepUpsertSchema, body);
    if (parsed.response) return parsed.response;

    const data = stripNulls(parsed.data as Record<string, unknown>) as {
      stepNumber: number;
      title: string;
      description: string;
      contentType?: "IMAGE" | "PAGE";
      imageUrl?: string | null;
      pageUrl?: string | null;
      coverImageUrl?: string | null;
      gradient?: string | null;
      link?: string | null;
      order?: number;
      published?: boolean;
    };

    const contentType = data.contentType ?? "IMAGE";
    const normalizedImageUrl =
      contentType === "IMAGE" ? normalizeImageUrl(data.imageUrl) : null;
    const normalizedCoverImageUrl = normalizeImageUrl(data.coverImageUrl);

    const item = await prisma.mobileScrollerStep.create({
      data: {
        stepNumber: data.stepNumber,
        title: data.title,
        description: data.description,
        contentType,
        imageUrl: normalizedImageUrl,
        pageUrl: contentType === "PAGE" ? data.pageUrl?.trim() || null : null,
        coverImageUrl: normalizedCoverImageUrl,
        gradient: data.gradient ?? null,
        link: data.link ?? null,
        order: data.order ?? data.stepNumber,
        published: data.published ?? true,
      },
    });

    return createdResponse(item, "مرحله اسکرولر موبایل با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating mobile scroller step:", error);
    return errorResponse(
      "خطا در ایجاد مرحله اسکرولر موبایل",
      ErrorCodes.DATABASE_ERROR,
      undefined,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
