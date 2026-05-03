/**
 * Admin Investment Models Page Management API (Single Item)
 * GET /api/admin/investment-models-page/[id] - Get investment models page by ID
 * PATCH /api/admin/investment-models-page/[id] - Update investment models page
 * DELETE /api/admin/investment-models-page/[id] - Delete investment models page
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getInvestmentModelsPageById,
  updateInvestmentModelsPage,
  deleteInvestmentModelsPage,
} from "@/lib/services/investment-models-service";
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

    const item = await getInvestmentModelsPageById(id);

    if (!item) {
      return notFoundResponse(
        "InvestmentModelsPage",
        "صفحه مدل‌های سرمایه‌ گذاری یافت نشد"
      );
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching investment models page:", error);
    return errorResponse(
      "خطا در دریافت صفحه مدل‌های سرمایه‌ گذاری",
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
    const existingItem = await getInvestmentModelsPageById(id);

    if (!existingItem) {
      return notFoundResponse(
        "InvestmentModelsPage",
        "صفحه مدل‌های سرمایه‌ گذاری یافت نشد"
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.additionalInfoTitle !== undefined)
      updateData.additionalInfoTitle = body.additionalInfoTitle;
    if (body.additionalInfoContent !== undefined)
      updateData.additionalInfoContent = body.additionalInfoContent;
    if (body.published !== undefined) updateData.published = body.published;

    const updatedItem = await updateInvestmentModelsPage(id, updateData);

    return successResponse(
      updatedItem,
      "صفحه مدل‌های سرمایه‌ گذاری با موفقیت بروزرسانی شد"
    );
  } catch (error) {
    console.error("Error updating investment models page:", error);
    return errorResponse(
      "خطا در بروزرسانی صفحه مدل‌های سرمایه‌ گذاری",
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
    const existingItem = await getInvestmentModelsPageById(id);

    if (!existingItem) {
      return notFoundResponse(
        "InvestmentModelsPage",
        "صفحه مدل‌های سرمایه‌ گذاری یافت نشد"
      );
    }

    // Delete item (cascading deletes will handle related models)
    await deleteInvestmentModelsPage(id);

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting investment models page:", error);
    return errorResponse(
      "خطا در حذف صفحه مدل‌های سرمایه‌ گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
