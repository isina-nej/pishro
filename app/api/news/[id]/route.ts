import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const article = await prisma.newsArticle.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!article) {
      return errorResponse("مقاله یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Increment views
    await prisma.newsArticle.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return successResponse(article);
  } catch (error) {
    console.error("Error fetching news article:", error);
    return errorResponse(
      "خطایی در دریافت مقاله رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      category,
      tags,
      published,
      publishedAt,
    } = body;

    // Check if article exists
    const existingArticle = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return errorResponse("مقاله یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Check if slug is being changed and if it's already taken
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await prisma.newsArticle.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return errorResponse(
          "این slug قبلاً استفاده شده است",
          ErrorCodes.ALREADY_EXISTS
        );
      }
    }

    // Update article
    const updatedArticle = await prisma.newsArticle.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        author,
        category,
        tags,
        published,
        publishedAt:
          published && !existingArticle.published
            ? publishedAt || new Date()
            : publishedAt,
      },
    });

    return successResponse(updatedArticle, "مقاله با موفقیت به‌روزرسانی شد");
  } catch (error) {
    console.error("Error updating news article:", error);
    return errorResponse(
      "خطایی در به‌روزرسانی مقاله رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if article exists
    const existingArticle = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return errorResponse("مقاله یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Delete article (comments will be cascade deleted)
    await prisma.newsArticle.delete({
      where: { id },
    });

    return successResponse(null, "مقاله با موفقیت حذف شد");
  } catch (error) {
    console.error("Error deleting news article:", error);
    return errorResponse(
      "خطایی در حذف مقاله رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
