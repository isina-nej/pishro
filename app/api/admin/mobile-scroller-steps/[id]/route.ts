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
  notFoundResponse,
  ErrorCodes,
  noContentResponse
} from "@/lib/api-response";
import { normalizeImageUrl } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("دسترسی محدود. فقط ادمین.", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    const item = await prisma.mobileScrollerStep.findUnique({
      where: { id }
    });

    if (!item) {
      return notFoundResponse(
        "MobileScrollerStep",
        "مرحله اسکرولر موبایل یافت نشد"
      );
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
    const session = await auth();
    if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("دسترسی محدود. فقط ادمین.", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;
    const body = await req.json();

    // 🔍 DEBUG
    console.log("=== BACKEND DEBUG ===");
    console.log("📥 body.link:", body.link);
    console.log("📥 typeof body.link:", typeof body.link);
    console.log("================");

    const existingItem = await prisma.mobileScrollerStep.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return notFoundResponse(
        "MobileScrollerStep",
        "مرحله اسکرولر موبایل یافت نشد"
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.stepNumber !== undefined) updateData.stepNumber = body.stepNumber;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.imageUrl !== undefined) {
      // Normalize imageUrl (extract original URL from Next.js optimization URLs)
      updateData.imageUrl = normalizeImageUrl(body.imageUrl);
    }
    if (body.coverImageUrl !== undefined) {
      // Normalize coverImageUrl (extract original URL from Next.js optimization URLs)
      updateData.coverImageUrl = normalizeImageUrl(body.coverImageUrl);
    }
    if (body.gradient !== undefined) updateData.gradient = body.gradient;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.link !== undefined) updateData.link = body.link;

    // 🔍 DEBUG
    console.log("📦 updateData.link:", updateData.link);
    console.log("================");

    const updatedItem = await prisma.mobileScrollerStep.update({
      where: { id },
      data: updateData
    });

    // 🔍 DEBUG
    console.log("✅ updatedItem.link:", updatedItem.link);
    console.log("================");

    return successResponse(
      updatedItem,
      "مرحله اسکرولر موبایل با موفقیت بروزرسانی شد"
    );
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
    const session = await auth();
    if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("دسترسی محدود. فقط ادمین.", ErrorCodes.UNAUTHORIZED);
    }

    const { id } = await params;

    // Check if item exists
    const existingItem = await prisma.mobileScrollerStep.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return notFoundResponse(
        "MobileScrollerStep",
        "مرحله اسکرولر موبایل یافت نشد"
      );
    }

    // Delete item
    await prisma.mobileScrollerStep.delete({
      where: { id }
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
