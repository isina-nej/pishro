import { prisma } from "@/lib/prisma";
import type { Lesson } from "@prisma/client";

/**
 * دریافت تمام کلاس‌های یک دوره
 */
export async function getLessonsByCourse(courseId: string) {
  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        courseId,
        published: true,
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        videoId: true,
        videoUrl: true,
        thumbnail: true,
        duration: true,
        order: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        courseId: true,
        published: true,
      },
    });

    return lessons;
  } catch (error) {
    console.error("Error fetching lessons by course:", error);
    return [];
  }
}

/**
 * دریافت یک کلاس خاص
 */
export async function getLessonById(lessonId: string) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            subject: true,
            slug: true,
          },
        },
      },
    });

    return lesson;
  } catch (error) {
    console.error("Error fetching lesson by ID:", error);
    return null;
  }
}

/**
 * افزایش تعداد بازدید کلاس
 */
export async function incrementLessonViews(lessonId: string) {
  try {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("Error incrementing lesson views:", error);
  }
}

/**
 * بررسی دسترسی کاربر به درس
 * کاربر باید در دوره مربوط به درس ثبت‌نام کرده باشد
 */
export async function checkUserAccessToLesson(
  userId: string,
  lessonId: string
): Promise<boolean> {
  try {
    // پیدا کردن درس و دوره مربوطه
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { courseId: true },
    });

    if (!lesson) {
      return false;
    }

    // بررسی اینکه کاربر در دوره ثبت‌نام کرده باشد
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId,
        },
      },
    });

    return !!enrollment;
  } catch (error) {
    console.error("Error checking user access to lesson:", error);
    return false;
  }
}

/**
 * ایجاد کلاس جدید (برای ادمین)
 */
export async function createLesson(data: {
  courseId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: string;
  order?: number;
  published?: boolean;
}) {
  try {
    const lesson = await prisma.lesson.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        thumbnail: data.thumbnail,
        duration: data.duration,
        order: data.order ?? 0,
        published: data.published ?? true,
      },
    });

    return lesson;
  } catch (error) {
    console.error("Error creating lesson:", error);
    throw error;
  }
}

/**
 * به‌روزرسانی کلاس (برای ادمین)
 */
export async function updateLesson(
  lessonId: string,
  data: Partial<Omit<Lesson, "id" | "createdAt" | "updatedAt">>
) {
  try {
    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data,
    });

    return lesson;
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw error;
  }
}

/**
 * حذف کلاس (برای ادمین)
 */
export async function deleteLesson(lessonId: string) {
  try {
    await prisma.lesson.delete({
      where: { id: lessonId },
    });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw error;
  }
}

/**
 * دریافت تمام کلاس‌ها (برای ادمین)
 */
export async function getAllLessons() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        course: {
          select: {
            id: true,
            subject: true,
            slug: true,
          },
        },
      },
      orderBy: [{ courseId: "asc" }, { order: "asc" }],
    });

    return lessons;
  } catch (error) {
    console.error("Error fetching all lessons:", error);
    return [];
  }
}
