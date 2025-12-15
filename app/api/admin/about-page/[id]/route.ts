/**
 * Admin About Page Management API (Single Item)
 * GET /api/admin/about-page/[id] - Get about page by ID
 * PATCH /api/admin/about-page/[id] - Update about page
 * DELETE /api/admin/about-page/[id] - Delete about page
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

    const item = await prisma.aboutPage.findUnique({
      where: { id },
      include: {
        resumeItems: true,
        teamMembers: true,
        certificates: true,
      },
    });

    if (!item) {
      return notFoundResponse("AboutPage", "صفحه درباره ما یافت نشد");
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching about page:", error);
    return errorResponse(
      "خطا در دریافت صفحه درباره ما",
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
    const existingItem = await prisma.aboutPage.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("AboutPage", "صفحه درباره ما یافت نشد");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.heroTitle !== undefined) updateData.heroTitle = body.heroTitle;
    if (body.heroSubtitle !== undefined) updateData.heroSubtitle = body.heroSubtitle;
    if (body.heroDescription !== undefined) updateData.heroDescription = body.heroDescription;
    if (body.heroBadgeText !== undefined) updateData.heroBadgeText = body.heroBadgeText;
    if (body.heroStats !== undefined) updateData.heroStats = body.heroStats;
    if (body.resumeTitle !== undefined) updateData.resumeTitle = body.resumeTitle;
    if (body.resumeSubtitle !== undefined) updateData.resumeSubtitle = body.resumeSubtitle;
    if (body.teamTitle !== undefined) updateData.teamTitle = body.teamTitle;
    if (body.teamSubtitle !== undefined) updateData.teamSubtitle = body.teamSubtitle;
    if (body.certificatesTitle !== undefined) updateData.certificatesTitle = body.certificatesTitle;
    if (body.certificatesSubtitle !== undefined) updateData.certificatesSubtitle = body.certificatesSubtitle;
    if (body.newsTitle !== undefined) updateData.newsTitle = body.newsTitle;
    if (body.newsSubtitle !== undefined) updateData.newsSubtitle = body.newsSubtitle;
    if (body.ctaTitle !== undefined) updateData.ctaTitle = body.ctaTitle;
    if (body.ctaDescription !== undefined) updateData.ctaDescription = body.ctaDescription;
    if (body.ctaButtonText !== undefined) updateData.ctaButtonText = body.ctaButtonText;
    if (body.ctaButtonLink !== undefined) updateData.ctaButtonLink = body.ctaButtonLink;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;
    if (body.metaKeywords !== undefined) updateData.metaKeywords = body.metaKeywords;
    if (body.published !== undefined) updateData.published = body.published;

    const updatedItem = await prisma.aboutPage.update({
      where: { id },
      data: updateData,
      include: {
        resumeItems: true,
        teamMembers: true,
        certificates: true,
      },
    });

    return successResponse(updatedItem, "صفحه درباره ما با موفقیت بروزرسانی شد");
  } catch (error) {
    console.error("Error updating about page:", error);
    return errorResponse(
      "خطا در بروزرسانی صفحه درباره ما",
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
    const existingItem = await prisma.aboutPage.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("AboutPage", "صفحه درباره ما یافت نشد");
    }

    // Delete item (cascading deletes will handle related items)
    await prisma.aboutPage.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting about page:", error);
    return errorResponse(
      "خطا در حذف صفحه درباره ما",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
