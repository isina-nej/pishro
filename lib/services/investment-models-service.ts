import { query, type QueryValues } from "@/lib/db";
import type { InvestmentModelsPage, InvestmentModel } from "@prisma/client";
import { 
  getInvestmentModelsPage as getPageMySQL, 
  getInvestmentModelsPageById as getPageByIdMySQL 
} from "./investment-models-mysql";

interface InvestmentModelsPageInput {
  additionalInfoTitle?: string;
  additionalInfoContent?: string;
  published?: boolean;
}

/**
 * دریافت صفحه Investment Models با تمام مدل‌های منتشر شده
 */
export async function getInvestmentModelsPage() {
  return await getPageMySQL();
}

/**
 * دریافت یک صفحه Investment Models خاص (برای ادمین)
 */
export async function getInvestmentModelsPageById(id: string) {
  return await getPageByIdMySQL(id);
}

/**
 * دریافت تمام صفحات Investment Models برای ادمین
 */
export async function getAllInvestmentModelsPagesForAdmin(options: {
  page: number;
  limit: number;
  published?: boolean | null;
}) {
  try {
    const { page, limit, published } = options;
    const offset = (page - 1) * limit;

    let whereClause = "";
    let countWhereClause = "";
    const params: QueryValues = [];

    if (published !== null && published !== undefined) {
      whereClause = "WHERE published = ?";
      countWhereClause = "WHERE published = ?";
      params.push(published ? 1 : 0);
    }

    // Get total count
    const countResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM InvestmentModelsPage ${countWhereClause}`,
      params
    );
    const total = countResult?.[0]?.count || 0;

    // Get paginated results
    const items = await query<InvestmentModelsPage>(
      `SELECT * FROM InvestmentModelsPage ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      items: items || [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Error fetching investment models pages for admin:", error);
    return { items: [], total: 0, page: options.page, limit: options.limit, totalPages: 0 };
  }
}

/**
 * ایجاد یک صفحه Investment Models جدید
 */
export async function createInvestmentModelsPage(data: InvestmentModelsPageInput) {
  try {
    const id = `imp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    await query(
      `INSERT INTO InvestmentModelsPage (id, additionalInfoTitle, additionalInfoContent, published, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.additionalInfoTitle || null, data.additionalInfoContent || null, data.published ? 1 : 0, now, now]
    );

    return { id, ...data, createdAt: now, updatedAt: now };
  } catch (error) {
    console.error("Error creating investment models page:", error);
    throw error;
  }
}

/**
 * بروزرسانی یک صفحه Investment Models
 */
export async function updateInvestmentModelsPage(id: string, data: InvestmentModelsPageInput) {
  try {
    const now = new Date().toISOString();
    const updates: string[] = [];
    const params: QueryValues = [];

    if (data.additionalInfoTitle !== undefined) {
      updates.push("additionalInfoTitle = ?");
      params.push(data.additionalInfoTitle || null);
    }
    if (data.additionalInfoContent !== undefined) {
      updates.push("additionalInfoContent = ?");
      params.push(data.additionalInfoContent || null);
    }
    if (data.published !== undefined) {
      updates.push("published = ?");
      params.push(data.published ? 1 : 0);
    }

    updates.push("updatedAt = ?");
    params.push(now);
    params.push(id);

    await query(
      `UPDATE InvestmentModelsPage SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

    return { id, ...data, updatedAt: now };
  } catch (error) {
    console.error("Error updating investment models page:", error);
    throw error;
  }
}

/**
 * حذف یک صفحه Investment Models
 */
export async function deleteInvestmentModelsPage(id: string) {
  try {
    // Delete associated models first
    await query(
      `DELETE FROM InvestmentModel WHERE investmentModelsPageId = ?`,
      [id]
    );

    // Delete the page
    await query(
      `DELETE FROM InvestmentModelsPage WHERE id = ?`,
      [id]
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting investment models page:", error);
    throw error;
  }
}

/**
 * دریافت یک مدل سرمایه‌گذاری خاص
 */
export async function getInvestmentModelById(id: string) {
  try {
    const result = await query<InvestmentModel>(
      `SELECT * FROM InvestmentModel WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!result || result.length === 0) {
      return null;
    }

    const model = result[0];
    return {
      ...model,
      features: model.features ? JSON.parse(String(model.features)) : [],
      benefits: model.benefits ? JSON.parse(String(model.benefits)) : [],
      contacts: model.contacts ? JSON.parse(String(model.contacts)) : [],
    };
  } catch (error) {
    console.error("Error fetching investment model by ID:", error);
    return null;
  }
}
