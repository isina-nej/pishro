// @/app/api/user/me/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ✅ Get complete user information
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        ...user,
        stats: {
          totalOrders: user._count.orders,
          totalEnrollments: user._count.enrollments,
          totalComments: user._count.comments,
        },
      },
    });
  } catch (error) {
    console.error("[GET /api/user/me] error:", error);
    return NextResponse.json(
      { ok: false, error: "خطایی در دریافت اطلاعات کاربر رخ داد" },
      { status: 500 }
    );
  }
}
