// @/lib/services/comment-service.ts
import { prisma } from "@/lib/prisma";
import { UserRoleType } from "@prisma/client";

interface GetCommentsOptions {
  categoryId?: string;
  courseId?: string;
  userId?: string;
  published?: boolean;
  verified?: boolean;
  featured?: boolean;
  limit?: number;
}

export async function getComments(options: GetCommentsOptions = {}) {
  const {
    categoryId,
    courseId,
    userId,
    published = true,
    verified,
    featured,
    limit,
  } = options;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(courseId && { courseId }),
        ...(userId && { userId }),
        published,
        ...(verified !== undefined && { verified }),
        ...(featured !== undefined && { featured }),
      },
      orderBy: [{ featured: "desc" }, { views: "desc" }, { createdAt: "desc" }],
      ...(limit && { take: limit }),
      include: {
        user: {
          select: {
            id: true,
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

    return comments;
  } catch (error) {
    console.error("خطا در دریافت نظرات:", error);
    throw new Error("خطا در دریافت نظرات");
  }
}

export async function getCommentById(id: string) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
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

    return comment;
  } catch (error) {
    console.error("خطا در دریافت نظر:", error);
    throw new Error("خطا در دریافت نظر");
  }
}

export async function createComment(data: {
  text: string;
  rating?: number;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
  userCompany?: string;
  categoryId?: string;
  courseId?: string;
}) {
  try {
    const comment = await prisma.comment.create({
      data: {
        text: data.text,
        rating: data.rating,
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        userRole: data.userRole as UserRoleType,
        userCompany: data.userCompany,
        categoryId: data.categoryId,
        courseId: data.courseId,
        published: false, // نیاز به تایید ادمین
      },
    });

    return comment;
  } catch (error) {
    console.error("خطا در ایجاد نظر:", error);
    throw new Error("خطا در ایجاد نظر");
  }
}

// Backward compatibility: keep old function names as aliases
export const getTestimonials = getComments;
export const getTestimonialById = getCommentById;
export const createTestimonial = createComment;
