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
    if (body.mainHeroTitle !== undefined) updateData.mainHeroTitle = body.mainHeroTitle;
    if (body.mainHeroSubtitle !== undefined) updateData.mainHeroSubtitle = body.mainHeroSubtitle;
    if (body.mainHeroCta1Text !== undefined) updateData.mainHeroCta1Text = body.mainHeroCta1Text;
    if (body.mainHeroCta1Link !== undefined) updateData.mainHeroCta1Link = body.mainHeroCta1Link;
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
    // Calculator fields
    if (body.calculatorTitle !== undefined) updateData.calculatorTitle = body.calculatorTitle;
    if (body.calculatorDescription !== undefined) updateData.calculatorDescription = body.calculatorDescription;
    if (body.calculatorRateLow !== undefined) updateData.calculatorRateLow = body.calculatorRateLow;
    if (body.calculatorRateMedium !== undefined) updateData.calculatorRateMedium = body.calculatorRateMedium;
    if (body.calculatorRateHigh !== undefined) updateData.calculatorRateHigh = body.calculatorRateHigh;
    if (body.calculatorPortfolioLowDesc !== undefined) updateData.calculatorPortfolioLowDesc = body.calculatorPortfolioLowDesc;
    if (body.calculatorPortfolioMediumDesc !== undefined) updateData.calculatorPortfolioMediumDesc = body.calculatorPortfolioMediumDesc;
    if (body.calculatorPortfolioHighDesc !== undefined) updateData.calculatorPortfolioHighDesc = body.calculatorPortfolioHighDesc;
    if (body.calculatorAmountSteps !== undefined) updateData.calculatorAmountSteps = body.calculatorAmountSteps;
    if (body.calculatorDurationSteps !== undefined) updateData.calculatorDurationSteps = body.calculatorDurationSteps;
    if (body.calculatorInPersonPhone !== undefined) updateData.calculatorInPersonPhone = body.calculatorInPersonPhone;
    if (body.calculatorOnlineTelegram !== undefined) updateData.calculatorOnlineTelegram = body.calculatorOnlineTelegram;
    if (body.calculatorOnlineTelegramLink !== undefined) updateData.calculatorOnlineTelegramLink = body.calculatorOnlineTelegramLink;
    // Meta fields
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
