// @/lib/services/testimonial-service.ts
import { prisma } from "@/lib/prisma";
import { UserRoleType } from "@prisma/client";

interface GetTestimonialsOptions {
  categoryId?: string;
  courseId?: string;
  published?: boolean;
  verified?: boolean;
  featured?: boolean;
  limit?: number;
}

export async function getTestimonials(options: GetTestimonialsOptions = {}) {
  const {
    categoryId,
    courseId,
    published = true,
    verified,
    featured,
    limit,
  } = options;

  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(courseId && { courseId }),
        published,
        ...(verified !== undefined && { verified }),
        ...(featured !== undefined && { featured }),
      },
      orderBy: [{ featured: "desc" }, { likes: "desc" }, { createdAt: "desc" }],
      ...(limit && { take: limit }),
    });

    return testimonials;
  } catch (error) {
    console.error("خطا در دریافت نظرات:", error);
    throw new Error("خطا در دریافت نظرات");
  }
}

export async function getTestimonialById(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    return testimonial;
  } catch (error) {
    console.error("خطا در دریافت نظر:", error);
    throw new Error("خطا در دریافت نظر");
  }
}

export async function createTestimonial(data: {
  userName: string;
  content: string;
  rating: number;
  userAvatar?: string;
  userRole?: string;
  userCompany?: string;
  categoryId?: string;
  courseId?: string;
}) {
  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        userName: data.userName,
        content: data.content,
        rating: data.rating,
        userAvatar: data.userAvatar,
        userRole: data.userRole as UserRoleType,
        userCompany: data.userCompany,
        categoryId: data.categoryId,
        courseId: data.courseId,
        published: false, // نیاز به تایید ادمین
      },
    });

    return testimonial;
  } catch (error) {
    console.error("خطا در ایجاد نظر:", error);
    throw new Error("خطا در ایجاد نظر");
  }
}
