/**
 * Admin Resume Item Management API (Single Item)
 * GET /api/admin/resume-items/[id] - Get resume item by ID
 * PATCH /api/admin/resume-items/[id] - Update resume item
 * DELETE /api/admin/resume-items/[id] - Delete resume item
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
    const { id } = await params;
    const item = await prisma.resumeItem.findUnique({
      where: { id },
      include: {
        aboutPage: {
          select: {
            id: true,
            heroTitle: true
          }
        }
      }
    });
    if (!item) {
      return notFoundResponse("ResumeItem", "آیتم رزومه یافت نشد");
    return successResponse(item);
  } catch (error) {
    console.error("Error fetching resume item:", error);
    return errorResponse(
      "خطا در دریافت آیتم رزومه",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
export async function PATCH(
    const body = await req.json();
    // Check if item exists
    const existingItem = await prisma.resumeItem.findUnique({
      where: { id }
    if (!existingItem) {
    // Prepare update data
    const updateData: Record<string, unknown> = {};
    // Only include fields that are provided
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.bgColor !== undefined) updateData.bgColor = body.bgColor;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;
    const updatedItem = await prisma.resumeItem.update({
      data: updateData,
    return successResponse(updatedItem, "آیتم رزومه با موفقیت بروزرسانی شد");
    console.error("Error updating resume item:", error);
      "خطا در بروزرسانی آیتم رزومه",
export async function DELETE(
    // Delete item
    await prisma.resumeItem.delete({
    return noContentResponse();
    console.error("Error deleting resume item:", error);
      "خطا در حذف آیتم رزومه",
