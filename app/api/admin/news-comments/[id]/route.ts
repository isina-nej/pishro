/**
 * Admin News Comment Management API (Single Comment)
 * GET /api/admin/news-comments/[id] - Get news comment by ID
 * PATCH /api/admin/news-comments/[id] - Update news comment
 * DELETE /api/admin/news-comments/[id] - Delete news comment
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

    const comment = await prisma.newsComment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!comment) {
      return notFoundResponse("NewsComment", "News comment not found");
    }

    return successResponse(comment);
  } catch (error) {
    console.error("Error fetching news comment:", error);
    return errorResponse(
      "Error fetching news comment",
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

    // Check if comment exists
    const existingComment = await prisma.newsComment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return notFoundResponse("NewsComment", "News comment not found");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.content !== undefined) updateData.content = body.content;

    const updatedComment = await prisma.newsComment.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(updatedComment, "News comment updated successfully");
  } catch (error) {
    console.error("Error updating news comment:", error);
    return errorResponse(
      "Error updating news comment",
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

    // Check if comment exists
    const existingComment = await prisma.newsComment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return notFoundResponse("NewsComment", "News comment not found");
    }

    // Delete comment
    await prisma.newsComment.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting news comment:", error);
    return errorResponse(
      "Error deleting news comment",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
