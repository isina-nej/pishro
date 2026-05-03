/**
 * Admin Investment Models Management API (Single Item)
 * GET /api/admin/investment-models/[id] - Get investment model by ID
 * PATCH /api/admin/investment-models/[id] - Update investment model
 * DELETE /api/admin/investment-models/[id] - Delete investment model
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getInvestmentModelById,
  updateInvestmentModel,
  deleteInvestmentModel,
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

    const item = await getInvestmentModelById(id);

    if (!item) {
      return notFoundResponse("InvestmentModel", "مدل سرمایه‌ گذاری یافت نشد");
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching investment model:", error);
    return errorResponse(
      "خطا در دریافت مدل سرمایه‌ گذاری",
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
    const existingItem = await getInvestmentModelById(id);

    if (!existingItem) {
      return notFoundResponse("InvestmentModel", "مدل سرمایه‌ گذاری یافت نشد");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.type !== undefined) updateData.type = body.type;
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined)
      updateData.description = body.description.trim();
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.gradient !== undefined) updateData.gradient = body.gradient;
    if (body.features !== undefined) updateData.features = body.features;
    if (body.benefits !== undefined) updateData.benefits = body.benefits;
    if (body.ctaText !== undefined) updateData.ctaText = body.ctaText.trim();
    if (body.ctaLink !== undefined) updateData.ctaLink = body.ctaLink;
    if (body.ctaIsScroll !== undefined) updateData.ctaIsScroll = body.ctaIsScroll;
    if (body.contactTitle !== undefined)
      updateData.contactTitle = body.contactTitle;
    if (body.contactDescription !== undefined)
      updateData.contactDescription = body.contactDescription;
    if (body.contacts !== undefined) updateData.contacts = body.contacts;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;

    const updatedItem = await updateInvestmentModel(id, updateData);

    return successResponse(
      updatedItem,
      "مدل سرمایه‌ گذاری با موفقیت بروزرسانی شد"
    );
  } catch (error) {
    console.error("Error updating investment model:", error);
    return errorResponse(
      "خطا در بروزرسانی مدل سرمایه‌ گذاری",
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
    const existingItem = await getInvestmentModelById(id);

    if (!existingItem) {
      return notFoundResponse("InvestmentModel", "مدل سرمایه‌ گذاری یافت نشد");
    }

    // Delete item
    await deleteInvestmentModel(id);

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting investment model:", error);
    return errorResponse(
      "خطا در حذف مدل سرمایه‌ گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
