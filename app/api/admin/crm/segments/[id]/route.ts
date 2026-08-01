/**
 * CRM Customer Segment detail endpoint
 * GET /api/admin/crm/segments/[id] - segment definition + a paginated,
 * read-time evaluation of matching customers (?page, ?limit).
 * PATCH /api/admin/crm/segments/[id] - update name/description/rules.
 * DELETE /api/admin/crm/segments/[id] - delete the segment.
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  ErrorCodes,
  noContentResponse,
  notFoundResponse,
  successResponse,
  validationError,
} from "@/lib/api-response";
import { UpdateCustomerSegmentSchema } from "@/lib/schemas/crm-segment-schema";
import { evaluateSegmentMembers } from "@/lib/services/customer-segment-service";
import type { SegmentRulesInput } from "@/lib/schemas/crm-segment-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const segment = await prisma.customerSegment.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
      },
    });

    if (!segment) {
      return notFoundResponse("Segment", "سگمنت مورد نظر یافت نشد");
    }

    const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(req.nextUrl.searchParams.get("limit") || "20"));

    const { items, total } = await evaluateSegmentMembers(
      segment.rules as SegmentRulesInput,
      { page, limit }
    );
    const totalPages = Math.ceil(total / limit) || 1;

    return successResponse({
      segment,
      members: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching CRM segment detail:", error);
    return errorResponse(
      "خطایی در دریافت اطلاعات سگمنت رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const existing = await prisma.customerSegment.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("Segment", "سگمنت مورد نظر یافت نشد");
    }

    const body = await req.json();
    const parsed = UpdateCustomerSegmentSchema.safeParse(body);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      return validationError(
        Object.fromEntries(
          Object.entries(fields).map(([key, messages]) => [key, messages?.[0] || ""])
        ),
        "اطلاعات ارسالی نامعتبر است"
      );
    }

    const segment = await prisma.customerSegment.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
        ...(parsed.data.description !== undefined
          ? { description: parsed.data.description }
          : {}),
        ...(parsed.data.rules !== undefined
          ? { rules: parsed.data.rules as Prisma.InputJsonValue }
          : {}),
      },
      include: {
        createdBy: { select: { id: true, name: true } },
      },
    });

    return successResponse(segment, "سگمنت با موفقیت ویرایش شد");
  } catch (error) {
    console.error("Error updating CRM segment:", error);
    return errorResponse(
      "خطایی در ویرایش سگمنت رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const existing = await prisma.customerSegment.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("Segment", "سگمنت مورد نظر یافت نشد");
    }

    await prisma.customerSegment.delete({ where: { id } });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting CRM segment:", error);
    return errorResponse(
      "خطایی در حذف سگمنت رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
