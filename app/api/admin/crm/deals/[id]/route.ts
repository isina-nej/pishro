/**
 * Admin CRM Deal Detail API
 * GET /api/admin/crm/deals/[id] - Deal detail incl. stage, lead, customer, order, ownerAdmin, activities
 * PATCH /api/admin/crm/deals/[id] - Update deal fields
 * DELETE /api/admin/crm/deals/[id] - Delete a deal
 *
 * Authentication: JWT Bearer token from admin login
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  successResponse,
  validationError,
  HttpStatus,
} from "@/lib/api-response";
import { DealUpdateSchema } from "@/lib/schemas/crm-deal-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

const dealDetailInclude = {
  stage: true,
  lead: { select: { id: true, firstName: true, lastName: true, phone: true } },
  customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
  order: { select: { id: true, total: true, status: true, createdAt: true } },
  ownerAdmin: { select: { id: true, name: true, email: true } },
  activities: {
    orderBy: { createdAt: "desc" },
    include: { admin: { select: { id: true, name: true } } },
  },
} satisfies Prisma.DealInclude;

export async function GET(
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
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: dealDetailInclude,
    });

    if (!deal) {
      return notFoundResponse("Deal", "فرصت فروش یافت نشد");
    }

    return successResponse(deal, "فرصت فروش با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching deal:", error);
    return errorResponse("Error fetching deal", ErrorCodes.DATABASE_ERROR);
  }
}

export async function PATCH(
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
    const parsed = DealUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors);
    }

    const { title, amount, stageId, leadId, customerId, ownerAdminId, expectedCloseDate } =
      parsed.data;

    if (stageId !== undefined) {
      const stage = await prisma.pipelineStage.findUnique({ where: { id: stageId } });
      if (!stage) {
        return validationError({ stageId: "مرحله پایپ‌لاین یافت نشد" });
      }
    }

    const data: Prisma.DealUpdateInput = {};
    if (title !== undefined) data.title = title;
    if (amount !== undefined) data.amount = amount;
    if (stageId !== undefined) data.stage = { connect: { id: stageId } };
    if (leadId !== undefined) {
      data.lead = leadId ? { connect: { id: leadId } } : { disconnect: true };
    }
    if (customerId !== undefined) {
      data.customer = customerId ? { connect: { id: customerId } } : { disconnect: true };
    }
    if (ownerAdminId !== undefined) {
      data.ownerAdmin = ownerAdminId ? { connect: { id: ownerAdminId } } : { disconnect: true };
    }
    if (expectedCloseDate !== undefined) data.expectedCloseDate = expectedCloseDate;

    const deal = await prisma.deal.update({
      where: { id },
      data,
      include: dealDetailInclude,
    });

    return successResponse(deal, "فرصت فروش با موفقیت ذخیره شد");
  } catch (error) {
    console.error("Error updating deal:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Deal", "فرصت فروش یافت نشد");
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return validationError({ general: "یکی از مقادیر ارجاعی معتبر نیست" });
    }
    return errorResponse("Error updating deal", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(
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
    await prisma.deal.delete({ where: { id } });

    return successResponse({ id }, "فرصت فروش با موفقیت حذف شد");
  } catch (error) {
    console.error("Error deleting deal:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Deal", "فرصت فروش یافت نشد");
    }
    return errorResponse("Error deleting deal", ErrorCodes.DATABASE_ERROR);
  }
}
