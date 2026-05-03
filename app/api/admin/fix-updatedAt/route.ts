// Admin endpoint to fix null updatedAt values in the database
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse
} from "@/lib/api-response";

export async function POST(_req: NextRequest) {
  try {
    // Check authentication
    if (!session?.user) {
      return "احراز هویت نشده است");
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { phone: session.user.phone as string },
      select: { role: true }
    });

    if (user?.role !== "ADMIN") {
      return "دسترسی غیرمجاز - فقط ادمین");
    }

    console.log("🔧 Starting database fix for null updatedAt values...");

    // Fix null updatedAt in Course collection
    const courseUpdateResult = await prisma.$runCommandRaw({
      update: "Course",
      updates: [
        {
          q: {
            $or: [{ updatedAt: null }, { updatedAt: { $exists: false } }]
          },
          u: {
            $set: {
              updatedAt: new Date()
            }
          },
          multi: true
        },
      ]
    });

    // Fix null updatedAt in User collection
    const userUpdateResult = await prisma.$runCommandRaw({
      update: "User",
      updates: [
        {
          q: {
            $or: [{ updatedAt: null }, { updatedAt: { $exists: false } }]
          },
          u: {
            $set: {
              updatedAt: new Date()
            }
          },
          multi: true
        },
      ]
    });

    console.log("✅ Database fix completed successfully!");

    return successResponse({
      message: "به‌روزرسانی با موفقیت انجام شد",
      courseUpdate: courseUpdateResult,
      userUpdate: userUpdateResult
    });
  } catch (error) {
    console.error("Error fixing updatedAt:", error);
    return errorResponse(
      "خطا در به‌روزرسانی پایگاه داده",
      "DATABASE_UPDATE_ERROR"
    );
  }
}
