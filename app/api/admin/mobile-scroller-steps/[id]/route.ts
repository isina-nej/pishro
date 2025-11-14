/**
 * Admin Mobile Scroller Step Management API (Single Item)
 * GET /api/admin/mobile-scroller-steps/[id] - Get mobile scroller step by ID
 * PATCH /api/admin/mobile-scroller-steps/[id] - Update mobile scroller step
 * DELETE /api/admin/mobile-scroller-steps/[id] - Delete mobile scroller step
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

    const item = await prisma.mobileScrollerStep.findUnique({
      where: { id },
    });

    if (!item) {
      return notFoundResponse("MobileScrollerStep", "مرحله اسکرولر موبایل یافت نشد");
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching mobile scroller step:", error);
    return errorResponse(
      "خطا در دریافت مرحله اسکرولر موبایل",
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
    const existingItem = await prisma.mobileScrollerStep.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("MobileScrollerStep", "مرحله اسکرولر موبایل یافت نشد");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.stepNumber !== undefined) updateData.stepNumber = body.stepNumber;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.gradient !== undefined) updateData.gradient = body.gradient;
    if (body.cards !== undefined) updateData.cards = body.cards;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;

    const updatedItem = await prisma.mobileScrollerStep.update({
      where: { id },
      data: updateData,
    });

    return successResponse(updatedItem, "مرحله اسکرولر موبایل با موفقیت بروزرسانی شد");
  } catch (error) {
    console.error("Error updating mobile scroller step:", error);
    return errorResponse(
      "خطا در بروزرسانی مرحله اسکرولر موبایل",
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
    const existingItem = await prisma.mobileScrollerStep.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("MobileScrollerStep", "مرحله اسکرولر موبایل یافت نشد");
    }

    // Delete item
    await prisma.mobileScrollerStep.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting mobile scroller step:", error);
    return errorResponse(
      "خطا در حذف مرحله اسکرولر موبایل",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
