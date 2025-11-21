/**
 * Admin Team Member Management API (Single Item)
 * GET /api/admin/team-members/[id] - Get team member by ID
 * PATCH /api/admin/team-members/[id] - Update team member
 * DELETE /api/admin/team-members/[id] - Delete team member
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
import { normalizeImageUrl } from "@/lib/utils";

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

    const item = await prisma.teamMember.findUnique({
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
      return notFoundResponse("TeamMember", "عضو تیم یافت نشد");
    }

    return successResponse(item);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return errorResponse(
      "خطا در دریافت عضو تیم",
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
    const existingItem = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("TeamMember", "عضو تیم یافت نشد");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.name !== undefined) updateData.name = body.name;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.image !== undefined) {
      // Normalize image URL (extract original URL from Next.js optimization URLs)
      updateData.image = normalizeImageUrl(body.image);
    }
    if (body.education !== undefined) updateData.education = body.education;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.specialties !== undefined) updateData.specialties = body.specialties;
    if (body.linkedinUrl !== undefined) updateData.linkedinUrl = body.linkedinUrl;
    if (body.emailUrl !== undefined) updateData.emailUrl = body.emailUrl;
    if (body.twitterUrl !== undefined) updateData.twitterUrl = body.twitterUrl;
    if (body.whatsappUrl !== undefined) updateData.whatsappUrl = body.whatsappUrl;
    if (body.telegramUrl !== undefined) updateData.telegramUrl = body.telegramUrl;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;

    const updatedItem = await prisma.teamMember.update({
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

    return successResponse(updatedItem, "عضو تیم با موفقیت بروزرسانی شد");
  } catch (error) {
    console.error("Error updating team member:", error);
    return errorResponse(
      "خطا در بروزرسانی عضو تیم",
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
    const existingItem = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return notFoundResponse("TeamMember", "عضو تیم یافت نشد");
    }

    // Delete item
    await prisma.teamMember.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting team member:", error);
    return errorResponse(
      "خطا در حذف عضو تیم",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
