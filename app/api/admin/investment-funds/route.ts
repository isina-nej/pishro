/**
 * Admin Investment Funds API
 * GET  /api/admin/investment-funds - لیست صندوق‌های سرمایه‌گذاری
 * POST /api/admin/investment-funds - ایجاد صندوق جدید
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  conflictResponse,
  createdResponse,
  errorResponse,
  ErrorCodes,
  successResponse,
  unauthorizedResponse,
  validationError,
} from "@/lib/api-response";
import { InvestmentFundCreateSchema } from "@/lib/schemas/investment-fund-schema";

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

export async function GET(req: NextRequest) {
  const adminUser = getAdminAuthFromRequest(req);
  if (!adminUser) {
    return unauthorizedResponse("لطفا برای ادامه وارد شوید");
  }

  try {
    const funds = await prisma.investmentFund.findMany({
      orderBy: { order: "asc" },
    });
    return successResponse(funds.map(serialize));
  } catch (error) {
    console.error("Error fetching investment funds:", error);
    return errorResponse("خطایی در دریافت صندوق‌ها رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(req: NextRequest) {
  const adminUser = getAdminAuthFromRequest(req);
  if (!adminUser) {
    return unauthorizedResponse("لطفا برای ادامه وارد شوید");
  }

  try {
    const body = await req.json();
    const parsed = InvestmentFundCreateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors, "اطلاعات وارد شده معتبر نیست");
    }

    const { minAmount, maxAmount, amountStep, ...rest } = parsed.data;

    const fund = await prisma.investmentFund.create({
      data: {
        ...rest,
        minAmount: BigInt(minAmount),
        maxAmount: BigInt(maxAmount),
        amountStep: BigInt(amountStep),
      },
    });

    return createdResponse(serialize(fund), "صندوق با موفقیت ایجاد شد");
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return conflictResponse("key", "این شناسه قبلاً استفاده شده است");
    }
    console.error("Error creating investment fund:", error);
    return errorResponse("خطایی در ایجاد صندوق رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}
