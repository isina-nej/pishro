/**
 * Admin Page Content Management API (Single Content)
 * GET /api/admin/page-content/[id] - Get page content by ID
 * PATCH /api/admin/page-content/[id] - Update page content
 * DELETE /api/admin/page-content/[id] - Delete page content
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

    const content = await prisma.pageContent.findUnique({
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

    if (!content) {
      return notFoundResponse("PageContent", "Page content not found");
    }

    return successResponse(content);
  } catch (error) {
    console.error("Error fetching page content:", error);
    return errorResponse(
      "Error fetching page content",
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

    // Check if content exists
    const existingContent = await prisma.pageContent.findUnique({
      where: { id },
    });

    if (!existingContent) {
      return notFoundResponse("PageContent", "Page content not found");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.type !== undefined) updateData.type = body.type;
    if (body.section !== undefined) updateData.section = body.section;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.language !== undefined) updateData.language = body.language;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.publishAt !== undefined) updateData.publishAt = body.publishAt ? new Date(body.publishAt) : null;
    if (body.expireAt !== undefined) updateData.expireAt = body.expireAt ? new Date(body.expireAt) : null;

    const updatedContent = await prisma.pageContent.update({
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

    return successResponse(updatedContent, "Page content updated successfully");
  } catch (error) {
    console.error("Error updating page content:", error);
    return errorResponse(
      "Error updating page content",
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

    // Check if content exists
    const existingContent = await prisma.pageContent.findUnique({
      where: { id },
    });

    if (!existingContent) {
      return notFoundResponse("PageContent", "Page content not found");
    }

    // Delete content
    await prisma.pageContent.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting page content:", error);
    return errorResponse(
      "Error deleting page content",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
