/**
 * Admin Home Landing Management API (Single Item)
 * GET /api/admin/home-landing/[id] - Get home landing by ID
 * PATCH /api/admin/home-landing/[id] - Update home landing
 * DELETE /api/admin/home-landing/[id] - Delete home landing
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

    const item = await prisma.homeLanding.findUnique({
      where: { id },
    });

    if (!item) {
      return notFoundResponse("HomeLanding", "صفحه لندینگ یافت نشد");
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching home landing page:", error);
    return errorResponse(
      "خطا در دریافت صفحه لندینگ",
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
    const existingItem = await prisma.homeLanding.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("HomeLanding", "صفحه لندینگ یافت نشد");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.heroTitle !== undefined) updateData.heroTitle = body.heroTitle;
    if (body.heroSubtitle !== undefined) updateData.heroSubtitle = body.heroSubtitle;
    if (body.heroDescription !== undefined) updateData.heroDescription = body.heroDescription;
    if (body.heroVideoUrl !== undefined) updateData.heroVideoUrl = body.heroVideoUrl;
    if (body.heroCta1Text !== undefined) updateData.heroCta1Text = body.heroCta1Text;
    if (body.heroCta1Link !== undefined) updateData.heroCta1Link = body.heroCta1Link;
    if (body.overlayTexts !== undefined) updateData.overlayTexts = body.overlayTexts;
    if (body.statsData !== undefined) updateData.statsData = body.statsData;
    if (body.whyUsTitle !== undefined) updateData.whyUsTitle = body.whyUsTitle;
    if (body.whyUsDescription !== undefined) updateData.whyUsDescription = body.whyUsDescription;
    if (body.whyUsItems !== undefined) updateData.whyUsItems = body.whyUsItems;
    if (body.newsClubTitle !== undefined) updateData.newsClubTitle = body.newsClubTitle;
    if (body.newsClubDescription !== undefined) updateData.newsClubDescription = body.newsClubDescription;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;
    if (body.metaKeywords !== undefined) updateData.metaKeywords = body.metaKeywords;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.order !== undefined) updateData.order = body.order;

    const updatedItem = await prisma.homeLanding.update({
      where: { id },
      data: updateData,
    });

    return successResponse(updatedItem, "صفحه لندینگ با موفقیت بروزرسانی شد");
  } catch (error) {
    console.error("Error updating home landing page:", error);
    return errorResponse(
      "خطا در بروزرسانی صفحه لندینگ",
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
    const existingItem = await prisma.homeLanding.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("HomeLanding", "صفحه لندینگ یافت نشد");
    }

    // Delete item
    await prisma.homeLanding.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting home landing page:", error);
    return errorResponse(
      "خطا در حذف صفحه لندینگ",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
