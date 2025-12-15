import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { auth } from "@/auth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const comments = await prisma.newsComment.findMany({
      where: { articleId: id },
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
    });

    return successResponse(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return errorResponse(
      "خطایی در دریافت نظرات رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse(
        "برای ثبت نظر باید وارد شوید",
        ErrorCodes.UNAUTHORIZED
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return errorResponse(
        "محتوای نظر نمی‌تواند خالی باشد",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // Check if article exists
    const article = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!article) {
      return errorResponse("مقاله یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Create comment
    const comment = await prisma.newsComment.create({
      data: {
        articleId: id,
        userId: session.user.id,
        content: content.trim(),
      },
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
    });

    return successResponse(comment, "نظر شما با موفقیت ثبت شد");
  } catch (error) {
    console.error("Error creating comment:", error);
    return errorResponse(
      "خطایی در ثبت نظر رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
