import { prisma } from "@/lib/prisma";
import type { SkyRoomClass } from "@prisma/client";

/**
 * دریافت تمام کلاس‌های اسکای‌روم منتشر شده
 */
export async function getAllSkyRoomClasses() {
  try {
    const classes = await prisma.skyRoomClass.findMany({
      where: {
        published: true,
      },
      orderBy: { order: "asc" },
    });

    return classes;
  } catch (error) {
    console.error("Error fetching skyroom classes:", error);
    return [];
  }
}

/**
 * دریافت یک کلاس اسکای‌روم خاص
 */
export async function getSkyRoomClassById(classId: string) {
  try {
    const skyRoomClass = await prisma.skyRoomClass.findUnique({
      where: { id: classId },
    });

    return skyRoomClass;
  } catch (error) {
    console.error("Error fetching skyroom class by ID:", error);
    return null;
  }
}

/**
 * دریافت تمام کلاس‌های اسکای‌روم (برای ادمین - بدون فیلتر published)
 */
export async function getAllSkyRoomClassesForAdmin() {
  try {
    const classes = await prisma.skyRoomClass.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return classes;
  } catch (error) {
    console.error("Error fetching skyroom classes for admin:", error);
    return [];
  }
}

/**
 * ایجاد کلاس اسکای‌روم جدید (برای ادمین)
 */
export async function createSkyRoomClass(data: {
  title: string;
  description?: string;
  instructor?: string;
  startDate?: Date;
  endDate?: Date;
  meetingLink: string;
  thumbnail?: string;
  duration?: string;
  capacity?: number;
  level?: string;
  order?: number;
  published?: boolean;
}) {
  try {
    const skyRoomClass = await prisma.skyRoomClass.create({
      data: {
        title: data.title,
        description: data.description,
        instructor: data.instructor,
        startDate: data.startDate,
        endDate: data.endDate,
        meetingLink: data.meetingLink,
        thumbnail: data.thumbnail,
        duration: data.duration,
        capacity: data.capacity,
        level: data.level,
        order: data.order ?? 0,
        published: data.published ?? true,
      },
    });

    return skyRoomClass;
  } catch (error) {
    console.error("Error creating skyroom class:", error);
    throw error;
  }
}

/**
 * به‌روزرسانی کلاس اسکای‌روم (برای ادمین)
 */
export async function updateSkyRoomClass(
  classId: string,
  data: Partial<Omit<SkyRoomClass, "id" | "createdAt" | "updatedAt">>
) {
  try {
    const skyRoomClass = await prisma.skyRoomClass.update({
      where: { id: classId },
      data,
    });

    return skyRoomClass;
  } catch (error) {
    console.error("Error updating skyroom class:", error);
    throw error;
  }
}

/**
 * حذف کلاس اسکای‌روم (برای ادمین)
 */
export async function deleteSkyRoomClass(classId: string) {
  try {
    await prisma.skyRoomClass.delete({
      where: { id: classId },
    });
  } catch (error) {
    console.error("Error deleting skyroom class:", error);
    throw error;
  }
}
