// @/app/api/comments/[id]/like/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("ابتدا وارد حساب خود شوید");
    }

    const { id } = await params;

    // Get the comment
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return errorResponse("نظر مورد یافت نشد", "COMMENT_NOT_FOUND");
    }

    // Check if user has already liked
    const userLikes = (comment.likes as string[]) || [];
    const userDislikes = (comment.dislikes as string[]) || [];

    const hasLiked = userLikes.includes(session.user.id);
    const hasDisliked = userDislikes.includes(session.user.id);

    let updatedLikes = userLikes;
    let updatedDislikes = userDislikes;

    if (hasLiked) {
      // Remove like
      updatedLikes = userLikes.filter((id: string) => id !== session.user.id);
    } else {
      // Add like
      updatedLikes = [...userLikes, session.user.id];
      // Remove dislike if exists
      if (hasDisliked) {
        updatedDislikes = userDislikes.filter((id: string) => id !== session.user.id);
      }
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        likes: updatedLikes,
        dislikes: updatedDislikes,
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

    return successResponse(updatedComment, "وضعیت لایک به‌روز شد");
  } catch (error) {
    console.error("Error in like comment:", error);
    return errorResponse(
      "خطایی در ثبت لایک رخ داد",
      "LIKE_ERROR"
    );
  }
}
