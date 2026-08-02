/**
 * Admin Investment Fund Detail API
 * GET    /api/admin/investment-funds/[id]
 * PATCH  /api/admin/investment-funds/[id]
 * DELETE /api/admin/investment-funds/[id]
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  conflictResponse,
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationError,
} from "@/lib/api-response";
import { InvestmentFundUpdateSchema } from "@/lib/schemas/investment-fund-schema";

function serialize(fund: {
  minAmount: bigint;
  maxAmount: bigint;
  amountStep: bigint;
  [key: string]: unknown;
}) {
  return {
    ...fund,
    minAmount: Number(fund.minAmount),
    maxAmount: Number(fund.maxAmount),
    amountStep: Number(fund.amountStep),
  };
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const adminUser = getAdminAuthFromRequest(req);
  if (!adminUser) {
    return unauthorizedResponse("لطفا برای ادامه وارد شوید");
  }

  const { id } = await params;
  const fund = await prisma.investmentFund.findUnique({ where: { id } });
  if (!fund) {
    return notFoundResponse("صندوق سرمایه‌گذاری", "صندوق مورد نظر یافت نشد");
  }

  return successResponse(serialize(fund));
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const adminUser = getAdminAuthFromRequest(req);
  if (!adminUser) {
    return unauthorizedResponse("لطفا برای ادامه وارد شوید");
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = InvestmentFundUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors, "اطلاعات وارد شده معتبر نیست");
    }

    const existing = await prisma.investmentFund.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("صندوق سرمایه‌گذاری", "صندوق مورد نظر یافت نشد");
    }

    const { minAmount, maxAmount, amountStep, ...rest } = parsed.data;

    const fund = await prisma.investmentFund.update({
      where: { id },
      data: {
        ...rest,
        ...(minAmount !== undefined && { minAmount: BigInt(minAmount) }),
        ...(maxAmount !== undefined && { maxAmount: BigInt(maxAmount) }),
        ...(amountStep !== undefined && { amountStep: BigInt(amountStep) }),
      },
    });

    return successResponse(serialize(fund), "صندوق با موفقیت به‌روزرسانی شد");
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return conflictResponse("key", "این شناسه قبلاً استفاده شده است");
    }
    console.error("Error updating investment fund:", error);
    return errorResponse("خطایی در به‌روزرسانی صندوق رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const adminUser = getAdminAuthFromRequest(req);
  if (!adminUser) {
    return unauthorizedResponse("لطفا برای ادامه وارد شوید");
  }

  const { id } = await params;

  try {
    const existing = await prisma.investmentFund.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("صندوق سرمایه‌گذاری", "صندوق مورد نظر یافت نشد");
    }

    await prisma.investmentFund.delete({ where: { id } });

    return successResponse(null, "صندوق با موفقیت حذف شد");
  } catch (error) {
    console.error("Error deleting investment fund:", error);
    return errorResponse("خطایی در حذف صندوق رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}
