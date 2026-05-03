/**
 * Admin Category Management API (Single Category)
 * GET /api/admin/categories/[id] - Get category by ID
 * PATCH /api/admin/categories/[id] - Update category
 * DELETE /api/admin/categories/[id] - Delete category
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
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        tags: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        _count: {
          select: {
            courses: true,
            content: true,
            news: true,
            faqs: true,
            comments: true,
            quizzes: true,
          },
        },
      },
    });

    if (!category) {
      return notFoundResponse("Category", "Category not found");
    }

    return successResponse(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return errorResponse(
      "Error fetching category",
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return notFoundResponse("Category", "Category not found");
    }

    // If slug is being updated, check uniqueness
    if (body.slug && body.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return errorResponse(
          "Category with this slug already exists",
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
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.coverImage !== undefined) {
      // Normalize coverImage URL (extract original URL from Next.js optimization URLs)
      updateData.coverImage = normalizeImageUrl(body.coverImage);
    }
    if (body.color !== undefined) updateData.color = body.color;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;
    if (body.metaKeywords !== undefined) updateData.metaKeywords = body.metaKeywords;
    if (body.heroTitle !== undefined) updateData.heroTitle = body.heroTitle;
    if (body.heroSubtitle !== undefined) updateData.heroSubtitle = body.heroSubtitle;
    if (body.heroDescription !== undefined) updateData.heroDescription = body.heroDescription;
    if (body.heroImage !== undefined) {
      // Normalize heroImage URL (extract original URL from Next.js optimization URLs)
      updateData.heroImage = normalizeImageUrl(body.heroImage);
    }
    if (body.heroCta1Text !== undefined) updateData.heroCta1Text = body.heroCta1Text;
    if (body.heroCta1Link !== undefined) updateData.heroCta1Link = body.heroCta1Link;
    if (body.heroCta2Text !== undefined) updateData.heroCta2Text = body.heroCta2Text;
    if (body.heroCta2Link !== undefined) updateData.heroCta2Link = body.heroCta2Link;
    if (body.aboutTitle1 !== undefined) updateData.aboutTitle1 = body.aboutTitle1;
    if (body.aboutTitle2 !== undefined) updateData.aboutTitle2 = body.aboutTitle2;
    if (body.aboutDescription !== undefined) updateData.aboutDescription = body.aboutDescription;
    if (body.aboutImage !== undefined) {
      // Normalize aboutImage URL (extract original URL from Next.js optimization URLs)
      updateData.aboutImage = normalizeImageUrl(body.aboutImage);
    }
    if (body.aboutCta1Text !== undefined) updateData.aboutCta1Text = body.aboutCta1Text;
    if (body.aboutCta1Link !== undefined) updateData.aboutCta1Link = body.aboutCta1Link;
    if (body.aboutCta2Text !== undefined) updateData.aboutCta2Text = body.aboutCta2Text;
    if (body.aboutCta2Link !== undefined) updateData.aboutCta2Link = body.aboutCta2Link;
    if (body.statsBoxes !== undefined) updateData.statsBoxes = body.statsBoxes;
    if (body.enableUserLevelSection !== undefined) updateData.enableUserLevelSection = body.enableUserLevelSection;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.tagIds !== undefined) updateData.tagIds = body.tagIds;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        tags: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return successResponse(updatedCategory, "Category updated successfully");
  } catch (error) {
    console.error("Error updating category:", error);
    return errorResponse(
      "Error updating category",
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            courses: true,
            news: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return notFoundResponse("Category", "Category not found");
    }

    // Check if category has associated content
    if (existingCategory._count.courses > 0 || existingCategory._count.news > 0) {
      return forbiddenResponse(
        "Cannot delete category with associated courses or news. Please reassign or delete them first."
      );
    }

    // Delete category (cascading deletes will handle related records)
    await prisma.category.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting category:", error);
    return errorResponse(
      "Error deleting category",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
