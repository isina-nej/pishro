/**
 * Admin Investment Tag Management API (Single Item)
 * GET /api/admin/investment-tags/[id] - Get investment tag by ID
 * PATCH /api/admin/investment-tags/[id] - Update investment tag
 * DELETE /api/admin/investment-tags/[id] - Delete investment tag
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

    const item = await prisma.investmentTag.findUnique({
      where: { id },
      include: {
        investmentPlans: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!item) {
      return notFoundResponse("InvestmentTag", "تگ سرمایه‌گذاری یافت نشد");
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching investment tag:", error);
    return errorResponse(
      "خطا در دریافت تگ سرمایه‌گذاری",
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
    const existingItem = await prisma.investmentTag.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("InvestmentTag", "تگ سرمایه‌گذاری یافت نشد");
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
            title: true,
          },
        },
      },
    });

    return successResponse(updatedItem, "تگ سرمایه‌گذاری با موفقیت بروزرسانی شد");
  } catch (error) {
    console.error("Error updating investment tag:", error);
    return errorResponse(
      "خطا در بروزرسانی تگ سرمایه‌گذاری",
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
    const existingItem = await prisma.investmentTag.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("InvestmentTag", "تگ سرمایه‌گذاری یافت نشد");
    }

    // Delete item
    await prisma.investmentTag.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting investment tag:", error);
    return errorResponse(
      "خطا در حذف تگ سرمایه‌گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
