/**
 * Admin CRM Deal Activities API
 * POST /api/admin/crm/deals/[id]/activities - Add an activity/note to a deal
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
  notFoundResponse,
  validationError,
  HttpStatus,
} from "@/lib/api-response";
import { DealActivityCreateSchema } from "@/lib/schemas/crm-deal-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();
    const parsed = DealActivityCreateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors);
    }

    const deal = await prisma.deal.findUnique({ where: { id }, select: { id: true } });
    if (!deal) {
      return notFoundResponse("Deal", "فرصت فروش یافت نشد");
    }

    const { type, content } = parsed.data;

    const activity = await prisma.activity.create({
      data: {
        type,
        content,
        dealId: id,
        adminId: adminUser.id,
      },
      include: { admin: { select: { id: true, name: true } } },
    });

    return createdResponse(activity, "فعالیت با موفقیت ثبت شد");
  } catch (error) {
    console.error("Error creating deal activity:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Deal", "فرصت فروش یافت نشد");
    }
    return errorResponse(
      "Error creating deal activity",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
