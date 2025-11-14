/**
 * Admin Home Landing Management API
 * GET /api/admin/home-landing - List all home landing pages
 * POST /api/admin/home-landing - Create a new home landing page
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  unauthorizedResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  forbiddenResponse,
  validationError,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود. فقط ادمین.");
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Filters
    const published = searchParams.get("published");

    // Build where clause
    const where: Prisma.HomeLandingWhereInput = {};

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    // Fetch home landing pages
    const [items, total] = await Promise.all([
      prisma.homeLanding.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
      }),
      prisma.homeLanding.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching home landing pages:", error);
    return errorResponse(
      "خطا در دریافت صفحات لندینگ",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفا وارد شوید");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("دسترسی محدود. فقط ادمین.");
    }

    const body = await req.json();
    const {
      mainHeroTitle,
      mainHeroSubtitle,
      mainHeroCta1Text,
      mainHeroCta1Link,
      heroTitle,
      heroSubtitle,
      heroDescription,
      heroVideoUrl,
      heroCta1Text,
      heroCta1Link,
      overlayTexts = [],
      statsData = [],
      whyUsTitle,
      whyUsDescription,
      whyUsItems = [],
      newsClubTitle,
      newsClubDescription,
      calculatorTitle,
      calculatorDescription,
      calculatorRateLow,
      calculatorRateMedium,
      calculatorRateHigh,
      calculatorPortfolioLowDesc,
      calculatorPortfolioMediumDesc,
      calculatorPortfolioHighDesc,
      calculatorAmountSteps,
      calculatorDurationSteps,
      calculatorInPersonPhone,
      calculatorOnlineTelegram,
      calculatorOnlineTelegramLink,
      metaTitle,
      metaDescription,
      metaKeywords = [],
      published = false,
      order = 0,
    } = body;

    // Validation
    if (!heroTitle) {
      return validationError({
        heroTitle: "عنوان Hero الزامی است",
      });
    }

    // Create home landing page
    const item = await prisma.homeLanding.create({
      data: {
        mainHeroTitle,
        mainHeroSubtitle,
        mainHeroCta1Text,
        mainHeroCta1Link,
        heroTitle,
        heroSubtitle,
        heroDescription,
        heroVideoUrl,
        heroCta1Text,
        heroCta1Link,
        overlayTexts,
        statsData,
        whyUsTitle,
        whyUsDescription,
        whyUsItems,
        newsClubTitle,
        newsClubDescription,
        calculatorTitle,
        calculatorDescription,
        calculatorRateLow,
        calculatorRateMedium,
        calculatorRateHigh,
        calculatorPortfolioLowDesc,
        calculatorPortfolioMediumDesc,
        calculatorPortfolioHighDesc,
        calculatorAmountSteps,
        calculatorDurationSteps,
        calculatorInPersonPhone,
        calculatorOnlineTelegram,
        calculatorOnlineTelegramLink,
        metaTitle,
        metaDescription,
        metaKeywords,
        published,
        order,
      },
    });

    return createdResponse(item, "صفحه لندینگ با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating home landing page:", error);
    return errorResponse(
      "خطا در ایجاد صفحه لندینگ",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
