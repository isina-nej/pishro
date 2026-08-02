/**
 * Investment Funds API (Public)
 * GET /api/investment-funds - لیست صندوق‌های فعال سرمایه‌گذاری برای ماشین‌حساب عمومی
 */

import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

export async function GET() {
  try {
    const funds = await prisma.investmentFund.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        key: true,
        name: true,
        description: true,
        monthlyRate: true,
        minDuration: true,
        maxDuration: true,
        durationStep: true,
        minAmount: true,
        maxAmount: true,
        amountStep: true,
        order: true,
      },
    });

    const serialized = funds.map((fund) => ({
      ...fund,
      minAmount: Number(fund.minAmount),
      maxAmount: Number(fund.maxAmount),
      amountStep: Number(fund.amountStep),
    }));

    return successResponse(serialized);
  } catch (error) {
    console.error("Error fetching investment funds:", error);
    return errorResponse("خطا در دریافت صندوق‌های سرمایه‌گذاری", ErrorCodes.DATABASE_ERROR);
  }
}
