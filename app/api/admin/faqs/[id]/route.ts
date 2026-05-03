/**
 * Admin FAQ Management API (Single FAQ)
 * GET /api/admin/faqs/[id] - Get FAQ by ID
 * PATCH /api/admin/faqs/[id] - Update FAQ
 * DELETE /api/admin/faqs/[id] - Delete FAQ
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
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;

    const faq = await prisma.fAQ.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    if (!faq) {
      return notFoundResponse("FAQ", "FAQ not found");
    }

    return successResponse(faq);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return errorResponse(
      "Error fetching FAQ",
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
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;
    const body = await req.json();

    // Check if FAQ exists
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existingFaq) {
      return notFoundResponse("FAQ", "FAQ not found");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.question !== undefined) updateData.question = body.question;
    if (body.answer !== undefined) updateData.answer = body.answer;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.faqCategory !== undefined) updateData.faqCategory = body.faqCategory;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.views !== undefined) updateData.views = body.views;
    if (body.helpful !== undefined) updateData.helpful = body.helpful;
    if (body.notHelpful !== undefined) updateData.notHelpful = body.notHelpful;

    const updatedFaq = await prisma.fAQ.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return successResponse(updatedFaq, "FAQ updated successfully");
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return errorResponse(
      "Error updating FAQ",
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
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;

    // Check if FAQ exists
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existingFaq) {
      return notFoundResponse("FAQ", "FAQ not found");
    }

    // Delete FAQ
    await prisma.fAQ.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return errorResponse(
      "Error deleting FAQ",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
