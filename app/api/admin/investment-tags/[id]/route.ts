/**
 * Admin Investment Tag Management API (Single Item)
 * GET /api/admin/investment-tags/[id] - Get investment tag by ID
 * PATCH /api/admin/investment-tags/[id] - Update investment tag
 * DELETE /api/admin/investment-tags/[id] - Delete investment tag
 */

import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { auth } from "@/auth";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  ErrorCodes,
  noContentResponse
} from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (!adminAuth) {
      return errorResponse("دسترسی محدود. فقط ادمین.", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    const item = await prisma.investmentTag.findUnique({
      where: { id },
      include: {
        investmentPlans: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!item) {
      return notFoundResponse("InvestmentTag", "تگ سرمایه‌ گذاری یافت نشد");
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching investment tag:", error);
    return errorResponse(
      "خطا در دریافت تگ سرمایه‌ گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (!adminAuth) {
      return errorResponse("دسترسی محدود. فقط ادمین.", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const body = await req.json();

    // Check if item exists
    const existingItem = await prisma.investmentTag.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return notFoundResponse("InvestmentTag", "تگ سرمایه‌ گذاری یافت نشد");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;

    const updatedItem = await prisma.investmentTag.update({
      where: { id },
      data: updateData,
      include: {
        investmentPlans: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return successResponse(
      updatedItem,
      "تگ سرمایه‌ گذاری با موفقیت بروزرسانی شد"
    );
  } catch (error) {
    console.error("Error updating investment tag:", error);
    return errorResponse(
      "خطا در بروزرسانی تگ سرمایه‌ گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (!adminAuth) {
      return errorResponse("دسترسی محدود. فقط ادمین.", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    // Check if item exists
    const existingItem = await prisma.investmentTag.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return notFoundResponse("InvestmentTag", "تگ سرمایه‌ گذاری یافت نشد");
    }

    // Delete item
    await prisma.investmentTag.delete({
      where: { id }
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting investment tag:", error);
    return errorResponse(
      "خطا در حذف تگ سرمایه‌ گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
