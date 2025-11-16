/**
 * Admin Investment Plans Management API (Single Item)
 * GET /api/admin/investment-plans/[id] - Get investment plans by ID
 * PATCH /api/admin/investment-plans/[id] - Update investment plans
 * DELETE /api/admin/investment-plans/[id] - Delete investment plans
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getInvestmentPlansById,
  updateInvestmentPlans,
  deleteInvestmentPlans,
} from "@/lib/services/investment-plans-service";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  ErrorCodes,
  noContentResponse,
} from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود. فقط ادمین.");
    }

    const { id } = await params;

    const item = await getInvestmentPlansById(id);

    if (!item) {
      return notFoundResponse("InvestmentPlans", "صفحه سبدهای سرمایه‌گذاری یافت نشد");
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching investment plans page:", error);
    return errorResponse(
      "خطا در دریافت صفحه سبدهای سرمایه‌گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود. فقط ادمین.");
    }

    const { id } = await params;
    const body = await req.json();

    // Check if item exists
    const existingItem = await getInvestmentPlansById(id);

    if (!existingItem) {
      return notFoundResponse("InvestmentPlans", "صفحه سبدهای سرمایه‌گذاری یافت نشد");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.image !== undefined) updateData.image = body.image;
    if (body.plansIntroCards !== undefined) updateData.plansIntroCards = body.plansIntroCards;
    if (body.minAmount !== undefined) updateData.minAmount = body.minAmount;
    if (body.maxAmount !== undefined) updateData.maxAmount = body.maxAmount;
    if (body.amountStep !== undefined) updateData.amountStep = body.amountStep;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;
    if (body.metaKeywords !== undefined) updateData.metaKeywords = body.metaKeywords;
    if (body.published !== undefined) updateData.published = body.published;

    const updatedItem = await updateInvestmentPlans(id, updateData);

    return successResponse(updatedItem, "صفحه سبدهای سرمایه‌گذاری با موفقیت بروزرسانی شد");
  } catch (error) {
    console.error("Error updating investment plans page:", error);
    return errorResponse(
      "خطا در بروزرسانی صفحه سبدهای سرمایه‌گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود. فقط ادمین.");
    }

    const { id } = await params;

    // Check if item exists
    const existingItem = await getInvestmentPlansById(id);

    if (!existingItem) {
      return notFoundResponse("InvestmentPlans", "صفحه سبدهای سرمایه‌گذاری یافت نشد");
    }

    // Delete item (cascading deletes will handle related items)
    await deleteInvestmentPlans(id);

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting investment plans page:", error);
    return errorResponse(
      "خطا در حذف صفحه سبدهای سرمایه‌گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
