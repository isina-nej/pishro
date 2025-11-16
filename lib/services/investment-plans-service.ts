import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * دریافت تمام صفحات سبدهای سرمایه‌گذاری منتشر شده
 */
export async function getAllInvestmentPlans() {
  try {
    const plans = await prisma.investmentPlans.findMany({
      where: {
        published: true,
      },
      include: {
        plans: {
          where: { published: true },
          orderBy: { order: "asc" },
        },
        tags: {
          where: { published: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return plans;
  } catch (error) {
    console.error("Error fetching investment plans:", error);
    return [];
  }
}

/**
 * دریافت یک صفحه سبدهای سرمایه‌گذاری خاص
 */
export async function getInvestmentPlansById(id: string) {
  try {
    const plan = await prisma.investmentPlans.findUnique({
      where: { id },
      include: {
        plans: {
          where: { published: true },
          orderBy: { order: "asc" },
        },
        tags: {
          where: { published: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return plan;
  } catch (error) {
    console.error("Error fetching investment plans by ID:", error);
    return null;
  }
}

/**
 * دریافت تمام صفحات سبدهای سرمایه‌گذاری (برای ادمین - بدون فیلتر published)
 */
export async function getAllInvestmentPlansForAdmin(params?: {
  page?: number;
  limit?: number;
  published?: boolean | null;
}) {
  try {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.InvestmentPlansWhereInput = {};

    if (params?.published !== undefined && params?.published !== null) {
      where.published = params.published;
    }

    const [items, total] = await Promise.all([
      prisma.investmentPlans.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          plans: {
            orderBy: { order: "asc" },
          },
          tags: {
            orderBy: { order: "asc" },
          },
        },
      }),
      prisma.investmentPlans.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching investment plans for admin:", error);
    throw error;
  }
}

/**
 * ایجاد صفحه سبدهای سرمایه‌گذاری جدید (برای ادمین)
 */
export async function createInvestmentPlans(data: {
  title: string;
  description: string;
  image?: string;
  plansIntroCards?: Prisma.InputJsonValue;
  minAmount?: number;
  maxAmount?: number;
  amountStep?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  published?: boolean;
}) {
  try {
    const plan = await prisma.investmentPlans.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        plansIntroCards: data.plansIntroCards ?? [],
        minAmount: data.minAmount ?? 10,
        maxAmount: data.maxAmount ?? 10000,
        amountStep: data.amountStep ?? 10,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords ?? [],
        published: data.published ?? false,
      },
      include: {
        plans: true,
        tags: true,
      },
    });

    return plan;
  } catch (error) {
    console.error("Error creating investment plans:", error);
    throw error;
  }
}

/**
 * به‌روزرسانی صفحه سبدهای سرمایه‌گذاری (برای ادمین)
 */
export async function updateInvestmentPlans(
  id: string,
  data: Prisma.InvestmentPlansUpdateInput
) {
  try {
    const plan = await prisma.investmentPlans.update({
      where: { id },
      data,
      include: {
        plans: {
          orderBy: { order: "asc" },
        },
        tags: {
          orderBy: { order: "asc" },
        },
      },
    });

    return plan;
  } catch (error) {
    console.error("Error updating investment plans:", error);
    throw error;
  }
}

/**
 * حذف صفحه سبدهای سرمایه‌گذاری (برای ادمین)
 */
export async function deleteInvestmentPlans(id: string) {
  try {
    await prisma.investmentPlans.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting investment plans:", error);
    throw error;
  }
}
