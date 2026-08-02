/**
 * Admin CRM Deals API
 * GET /api/admin/crm/deals - List deals with pagination, optionally filtered by stageId
 * POST /api/admin/crm/deals - Create a new deal
 *
 * Authentication: JWT Bearer token from admin login
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  paginatedResponse,
  validationError,
  HttpStatus,
} from "@/lib/api-response";
import { DealCreateSchema } from "@/lib/schemas/crm-deal-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

const dealInclude = {
  stage: true,
  lead: { select: { id: true, firstName: true, lastName: true, phone: true } },
  customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
  ownerAdmin: { select: { id: true, name: true } },
} satisfies Prisma.DealInclude;

export async function GET(req: NextRequest) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse(
        "Please login to continue",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    const searchParams = req.nextUrl.searchParams;

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(200, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const stageId = searchParams.get("stageId");
    const search = searchParams.get("search");

    const where: Prisma.DealWhereInput = {};
    if (stageId) {
      where.stageId = stageId;
    }
    if (search) {
      where.title = { contains: search };
    }

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: dealInclude,
      }),
      prisma.deal.count({ where }),
    ]);

    return paginatedResponse(deals, page, limit, total);
  } catch (error) {
    console.error("Error fetching deals:", error);
    return errorResponse("Error fetching deals", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse(
        "Please login to continue",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    const body = await req.json();
    const parsed = DealCreateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors);
    }

    const { title, amount, stageId, leadId, customerId, ownerAdminId, expectedCloseDate } =
      parsed.data;

    const stage = await prisma.pipelineStage.findUnique({ where: { id: stageId } });
    if (!stage) {
      return validationError({ stageId: "مرحله پایپ‌لاین یافت نشد" });
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        amount: amount ?? null,
        stageId,
        leadId: leadId || null,
        customerId: customerId || null,
        ownerAdminId: ownerAdminId || null,
        expectedCloseDate: expectedCloseDate ?? null,
      },
      include: dealInclude,
    });

    return createdResponse(deal, "فرصت فروش با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating deal:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return validationError({ general: "یکی از مقادیر ارجاعی (سرنخ/مشتری) معتبر نیست" });
    }
    return errorResponse("Error creating deal", ErrorCodes.DATABASE_ERROR);
  }
}
