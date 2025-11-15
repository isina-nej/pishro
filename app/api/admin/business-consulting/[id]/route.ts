/**
 * Admin Investment Consulting Management API (Single Item)
 * GET /api/admin/investment-consulting/[id] - Get investment consulting by ID
 * PATCH /api/admin/investment-consulting/[id] - Update investment consulting
 * DELETE /api/admin/investment-consulting/[id] - Delete investment consulting
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

    const item = await prisma.investmentConsulting.findUnique({
      where: { id },
    });

    if (!item) {
      return notFoundResponse(
        "InvestmentConsulting",
        "صفحه مشاوره سرمایه‌گذاری یافت نشد"
      );
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching investment consulting page:", error);
    return errorResponse(
      "خطا در دریافت صفحه مشاوره سرمایه‌گذاری",
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
    const existingItem = await prisma.investmentConsulting.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse(
        "InvestmentConsulting",
        "صفحه مشاوره سرمایه‌گذاری یافت نشد"
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.phoneNumber !== undefined)
      updateData.phoneNumber = body.phoneNumber;
    if (body.telegramId !== undefined) updateData.telegramId = body.telegramId;
    if (body.telegramLink !== undefined)
      updateData.telegramLink = body.telegramLink;
    if (body.coursesLink !== undefined)
      updateData.coursesLink = body.coursesLink;
    if (body.inPersonTitle !== undefined)
      updateData.inPersonTitle = body.inPersonTitle;
    if (body.inPersonDescription !== undefined)
      updateData.inPersonDescription = body.inPersonDescription;
    if (body.onlineTitle !== undefined)
      updateData.onlineTitle = body.onlineTitle;
    if (body.onlineDescription !== undefined)
      updateData.onlineDescription = body.onlineDescription;
    if (body.coursesTitle !== undefined)
      updateData.coursesTitle = body.coursesTitle;
    if (body.coursesDescription !== undefined)
      updateData.coursesDescription = body.coursesDescription;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined)
      updateData.metaDescription = body.metaDescription;
    if (body.metaKeywords !== undefined)
      updateData.metaKeywords = body.metaKeywords;
    if (body.published !== undefined) updateData.published = body.published;

    const updatedItem = await prisma.investmentConsulting.update({
      where: { id },
      data: updateData,
    });

    return successResponse(
      updatedItem,
      "صفحه مشاوره سرمایه‌گذاری با موفقیت بروزرسانی شد"
    );
  } catch (error) {
    console.error("Error updating investment consulting page:", error);
    return errorResponse(
      "خطا در بروزرسانی صفحه مشاوره سرمایه‌گذاری",
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
    const existingItem = await prisma.investmentConsulting.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse(
        "InvestmentConsulting",
        "صفحه مشاوره سرمایه‌گذاری یافت نشد"
      );
    }

    // Delete item
    await prisma.investmentConsulting.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting investment consulting page:", error);
    return errorResponse(
      "خطا در حذف صفحه مشاوره سرمایه‌گذاری",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
