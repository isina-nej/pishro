/**
 * Admin Certificate Management API (Single Item)
 * GET /api/admin/certificates/[id] - Get certificate by ID
 * PATCH /api/admin/certificates/[id] - Update certificate
 * DELETE /api/admin/certificates/[id] - Delete certificate
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

    const item = await prisma.certificate.findUnique({
      where: { id },
      include: {
        aboutPage: {
          select: {
            id: true,
            heroTitle: true,
          },
        },
      },
    });

    if (!item) {
      return notFoundResponse("Certificate", "گواهینامه یافت نشد");
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return errorResponse(
      "خطا در دریافت گواهینامه",
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
    const existingItem = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("Certificate", "گواهینامه یافت نشد");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;

    const updatedItem = await prisma.certificate.update({
      where: { id },
      data: updateData,
      include: {
        aboutPage: {
          select: {
            id: true,
            heroTitle: true,
          },
        },
      },
    });

    return successResponse(updatedItem, "گواهینامه با موفقیت بروزرسانی شد");
  } catch (error) {
    console.error("Error updating certificate:", error);
    return errorResponse(
      "خطا در بروزرسانی گواهینامه",
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
    const existingItem = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("Certificate", "گواهینامه یافت نشد");
    }

    // Delete item
    await prisma.certificate.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return errorResponse(
      "خطا در حذف گواهینامه",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
