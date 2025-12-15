/**
 * Admin Comment Management API (Single Comment)
 * GET /api/admin/comments/[id] - Get comment by ID
 * PATCH /api/admin/comments/[id] - Update comment
 * DELETE /api/admin/comments/[id] - Delete comment
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

    const comment = await prisma.comment.findUnique({
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
        course: {
          select: {
            id: true,
            subject: true,
            slug: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!comment) {
      return notFoundResponse("Comment", "Comment not found");
    }

    return successResponse(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    return errorResponse(
      "Error fetching comment",
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
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return notFoundResponse("Comment", "Comment not found");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.text !== undefined) updateData.text = body.text;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.userName !== undefined) updateData.userName = body.userName;
    if (body.userAvatar !== undefined) updateData.userAvatar = body.userAvatar;
    if (body.userRole !== undefined) updateData.userRole = body.userRole;
    if (body.userCompany !== undefined) updateData.userCompany = body.userCompany;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.verified !== undefined) updateData.verified = body.verified;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.views !== undefined) updateData.views = body.views;

    const updatedComment = await prisma.comment.update({
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
        course: {
          select: {
            id: true,
            subject: true,
            slug: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(updatedComment, "Comment updated successfully");
  } catch (error) {
    console.error("Error updating comment:", error);
    return errorResponse(
      "Error updating comment",
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
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return notFoundResponse("Comment", "Comment not found");
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting comment:", error);
    return errorResponse(
      "Error deleting comment",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
