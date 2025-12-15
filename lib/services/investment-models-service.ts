import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * دریافت صفحه Investment Models با تمام مدل‌های منتشر شده
 */
export async function getInvestmentModelsPage() {
  try {
    const page = await prisma.investmentModelsPage.findFirst({
      where: {
        published: true,
      },
      include: {
        models: {
          where: { published: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return page;
  } catch (error) {
    console.error("Error fetching investment models page:", error);
    return null;
  }
}

/**
 * دریافت یک صفحه Investment Models خاص (برای ادمین)
 */
export async function getInvestmentModelsPageById(id: string) {
  try {
    const page = await prisma.investmentModelsPage.findUnique({
      where: { id },
      include: {
        models: {
          orderBy: { order: "asc" },
        },
      },
    });

    return page;
  } catch (error) {
    console.error("Error fetching investment models page by ID:", error);
    return null;
  }
}

/**
 * دریافت تمام صفحات Investment Models (برای ادمین)
 */
export async function getAllInvestmentModelsPagesForAdmin(params?: {
  page?: number;
  limit?: number;
  published?: boolean | null;
}) {
  try {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.InvestmentModelsPageWhereInput = {};

    if (params?.published !== undefined && params?.published !== null) {
      where.published = params.published;
    }

    const [items, total] = await Promise.all([
      prisma.investmentModelsPage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          models: {
            orderBy: { order: "asc" },
          },
        },
      }),
      prisma.investmentModelsPage.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching investment models pages for admin:", error);
    throw error;
  }
}

/**
 * ایجاد صفحه Investment Models جدید (برای ادمین)
 */
export async function createInvestmentModelsPage(data: {
  additionalInfoTitle?: string;
  additionalInfoContent?: string;
  published?: boolean;
}) {
  try {
    const page = await prisma.investmentModelsPage.create({
      data: {
        additionalInfoTitle: data.additionalInfoTitle,
        additionalInfoContent: data.additionalInfoContent,
        published: data.published ?? true,
      },
      include: {
        models: true,
      },
    });

    return page;
  } catch (error) {
    console.error("Error creating investment models page:", error);
    throw error;
  }
}

/**
 * به‌روزرسانی صفحه Investment Models (برای ادمین)
 */
export async function updateInvestmentModelsPage(
  id: string,
  data: Prisma.InvestmentModelsPageUpdateInput
) {
  try {
    const page = await prisma.investmentModelsPage.update({
      where: { id },
      data,
      include: {
        models: {
          orderBy: { order: "asc" },
        },
      },
    });

    return page;
  } catch (error) {
    console.error("Error updating investment models page:", error);
    throw error;
  }
}

/**
 * حذف صفحه Investment Models (برای ادمین)
 */
export async function deleteInvestmentModelsPage(id: string) {
  try {
    await prisma.investmentModelsPage.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting investment models page:", error);
    throw error;
  }
}

// ==================== Investment Model CRUD ====================

/**
 * دریافت یک مدل سرمایه‌گذاری خاص
 */
export async function getInvestmentModelById(id: string) {
  try {
    const model = await prisma.investmentModel.findUnique({
      where: { id },
    });

    return model;
  } catch (error) {
    console.error("Error fetching investment model by ID:", error);
    return null;
  }
}

/**
 * ایجاد مدل سرمایه‌گذاری جدید (برای ادمین)
 */
export async function createInvestmentModel(data: {
  investmentModelsPageId: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  features?: Prisma.InputJsonValue;
  benefits?: string[];
  ctaText: string;
  ctaLink?: string;
  ctaIsScroll?: boolean;
  contactTitle?: string;
  contactDescription?: string;
  contacts?: Prisma.InputJsonValue;
  order?: number;
  published?: boolean;
}) {
  try {
    const model = await prisma.investmentModel.create({
      data: {
        investmentModelsPageId: data.investmentModelsPageId,
        type: data.type,
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
        gradient: data.gradient,
        features: data.features ?? [],
        benefits: data.benefits ?? [],
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        ctaIsScroll: data.ctaIsScroll ?? false,
        contactTitle: data.contactTitle,
        contactDescription: data.contactDescription,
        contacts: data.contacts ?? [],
        order: data.order ?? 0,
        published: data.published ?? true,
      },
    });

    return model;
  } catch (error) {
    console.error("Error creating investment model:", error);
    throw error;
  }
}

/**
 * به‌روزرسانی مدل سرمایه‌گذاری (برای ادمین)
 */
export async function updateInvestmentModel(
  id: string,
  data: Prisma.InvestmentModelUpdateInput
) {
  try {
    const model = await prisma.investmentModel.update({
      where: { id },
      data,
    });

    return model;
  } catch (error) {
    console.error("Error updating investment model:", error);
    throw error;
  }
}

/**
 * حذف مدل سرمایه‌گذاری (برای ادمین)
 */
export async function deleteInvestmentModel(id: string) {
  try {
    await prisma.investmentModel.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting investment model:", error);
    throw error;
  }
}
