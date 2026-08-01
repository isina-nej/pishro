/**
 * CRM Customer Segments endpoint
 * GET /api/admin/crm/segments - list all segments (definitions only; member
 * counts are evaluated lazily on the segment detail endpoint to avoid an
 * N+1 rule-evaluation cost on the list page).
 * POST /api/admin/crm/segments - create a new rule-based segment.
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  successResponse,
  validationError,
} from "@/lib/api-response";
import { CreateCustomerSegmentSchema } from "@/lib/schemas/crm-segment-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function GET(req: NextRequest) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const segments = await prisma.customerSegment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { id: true, name: true } },
      },
    });

    return successResponse(segments);
  } catch (error) {
    console.error("Error fetching CRM segments:", error);
    return errorResponse(
      "خطایی در دریافت سگمنت‌ها رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const body = await req.json();
    const parsed = CreateCustomerSegmentSchema.safeParse(body);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      return validationError(
        Object.fromEntries(
          Object.entries(fields).map(([key, messages]) => [key, messages?.[0] || ""])
        ),
        "اطلاعات ارسالی نامعتبر است"
      );
    }

    const segment = await prisma.customerSegment.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        rules: parsed.data.rules as Prisma.InputJsonValue,
        createdById: adminUser.id,
      },
      include: {
        createdBy: { select: { id: true, name: true } },
      },
    });

    return createdResponse(segment, "سگمنت با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating CRM segment:", error);
    return errorResponse(
      "خطایی در ایجاد سگمنت رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
