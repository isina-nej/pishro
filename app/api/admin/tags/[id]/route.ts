/**
 * Admin Tag Management API (Single Tag)
 * GET /api/admin/tags/[id] - Get tag by ID
 * PATCH /api/admin/tags/[id] - Update tag
 * DELETE /api/admin/tags/[id] - Delete tag
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

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            categories: true,
            courses: true,
            news: true,
            books: true,
          },
        },
      },
    });

    if (!tag) {
      return notFoundResponse("Tag", "Tag not found");
    }

    return successResponse(tag);
  } catch (error) {
    console.error("Error fetching tag:", error);
    return errorResponse(
      "Error fetching tag",
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

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return notFoundResponse("Tag", "Tag not found");
    }

    // If slug is being updated, check uniqueness
    if (body.slug && body.slug !== existingTag.slug) {
      const slugExists = await prisma.tag.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return errorResponse(
          "Tag with this slug already exists",
          ErrorCodes.ALREADY_EXISTS
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.seoTitle !== undefined) updateData.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined) updateData.seoDescription = body.seoDescription;
    if (body.usageCount !== undefined) updateData.usageCount = body.usageCount;
    if (body.clicks !== undefined) updateData.clicks = body.clicks;

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: updateData,
    });

    return successResponse(updatedTag, "Tag updated successfully");
  } catch (error) {
    console.error("Error updating tag:", error);
    return errorResponse(
      "Error updating tag",
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

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return notFoundResponse("Tag", "Tag not found");
    }

    // Delete tag (many-to-many relations will be handled automatically)
    await prisma.tag.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting tag:", error);
    return errorResponse(
      "Error deleting tag",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
