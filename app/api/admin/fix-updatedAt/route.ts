// Admin endpoint to fix null updatedAt values in the database
import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  HttpStatus,
} from "@/lib/api-response";

export async function POST(_req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(_req);
    if (!adminAuth) {
      return errorResponse(
        "احراز هویت نشده است",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    console.log("🔧 Starting database fix for null updatedAt values...");

    // Fix null updatedAt in Course table using SQL
    const courseUpdateResult = await prisma.$executeRawUnsafe(
      `UPDATE Course SET updatedAt = NOW() WHERE updatedAt IS NULL`
    );

    // Fix null updatedAt in User table using SQL
    const userUpdateResult = await prisma.$executeRawUnsafe(
      `UPDATE User SET updatedAt = NOW() WHERE updatedAt IS NULL`
    );

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
