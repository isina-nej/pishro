/**
 * Admin About Page Management API
 * GET /api/admin/about-page - List all about pages
 * POST /api/admin/about-page - Create a new about page
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { Prisma } from "@/types/prisma";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  validationError
} from "@/lib/api-response";
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("دسترسی محدود. فقط ادمین.", ErrorCodes.UNAUTHORIZED);
    const searchParams = req.nextUrl.searchParams;
    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;
    // Filters
    const published = searchParams.get("published");
    // Build where clause
    const where: Prisma.AboutPageWhereInput = {};
    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    // Fetch about pages
    const [items, total] = await Promise.all([
      prisma.aboutPage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          resumeItems: true,
          teamMembers: true,
          certificates: true
        }
      }),
      prisma.aboutPage.count({ where }),
    ]);
    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching about pages:", error);
    return errorResponse(
      "خطا در دریافت صفحات درباره ما",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
export async function POST(req: NextRequest) {
    const body = await req.json();
    const {
      heroTitle,
      heroSubtitle,
      heroDescription,
      heroBadgeText,
      heroStats = [],
      resumeTitle,
      resumeSubtitle,
      teamTitle,
      teamSubtitle,
      certificatesTitle,
      certificatesSubtitle,
      newsTitle,
      newsSubtitle,
      ctaTitle,
      ctaDescription,
      ctaButtonText,
      ctaButtonLink,
      metaTitle,
      metaDescription,
      metaKeywords = [],
      published = false
    } = body;
    // Validation
    if (!heroTitle) {
      return validationError({
        heroTitle: "عنوان Hero الزامی است"
      });
    // Create about page
    const item = await prisma.aboutPage.create({
      data: {
        heroTitle,
        heroSubtitle,
        heroDescription,
        heroBadgeText,
        heroStats,
        resumeTitle,
        resumeSubtitle,
        teamTitle,
        teamSubtitle,
        certificatesTitle,
        certificatesSubtitle,
        newsTitle,
        newsSubtitle,
        ctaTitle,
        ctaDescription,
        ctaButtonText,
        ctaButtonLink,
        metaTitle,
        metaDescription,
        metaKeywords,
        published
      },
      include: {
        resumeItems: true,
        teamMembers: true,
        certificates: true
      }
    });
    return createdResponse(item, "صفحه درباره ما با موفقیت ایجاد شد");
    console.error("Error creating about page:", error);
      "خطا در ایجاد صفحه درباره ما",
