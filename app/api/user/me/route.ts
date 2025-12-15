// @/app/api/user/me/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

// ✅ Get complete user information
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        phone: true,
        phoneVerified: true,
        firstName: true,
        lastName: true,
        email: true,
        nationalCode: true,
        birthDate: true,
        avatarUrl: true,
        cardNumber: true,
        shebaNumber: true,
        accountOwner: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            enrollments: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return notFoundResponse("User", "کاربر یافت نشد");
    }

    return successResponse({
      ...user,
      stats: {
        totalOrders: user._count.orders,
        totalEnrollments: user._count.enrollments,
        totalComments: user._count.comments,
      },
    });
  } catch (error) {
    console.error("[GET /api/user/me] error:", error);
    return errorResponse(
      "خطایی در دریافت اطلاعات کاربر رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
