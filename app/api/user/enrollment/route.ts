// @/app/api/user/enrollment/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  unauthorizedResponse,
  validationError,
  forbiddenResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

// ✅ Update enrollment progress
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const { enrollmentId, progress, completed } = await req.json();

    if (!enrollmentId) {
      return validationError(
        { enrollmentId: "شناسه ثبت‌نام الزامی است" },
        "اطلاعات ناقص است"
      );
    }

    // Verify enrollment belongs to user
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      return validationError(
        { enrollmentId: "ثبت‌نام یافت نشد" },
        "ثبت‌نام یافت نشد"
      );
    }

    if (enrollment.userId !== session.user.id) {
      return forbiddenResponse("شما مجاز به ویرایش این ثبت‌نام نیستید");
    }

    // Update enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress:
          progress !== undefined
            ? Math.min(Math.max(progress, 0), 100)
            : undefined,
        completedAt: completed ? new Date() : undefined,
        lastAccessAt: new Date(),
      },
    });

    return successResponse(
      updatedEnrollment,
      "پیشرفت دوره با موفقیت بروزرسانی شد"
    );
  } catch (error) {
    console.error("[PATCH /api/user/enrollment] error:", error);
    return errorResponse(
      "خطایی در بروزرسانی پیشرفت دوره رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
