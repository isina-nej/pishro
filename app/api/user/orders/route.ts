// @/app/api/user/orders/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ✅ Get all user's orders
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status"); // "pending", "paid", "failed"
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId: session.user.id };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // For each order, fetch course details from items JSON
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const courseIds = (order.items as { courseId: string }[]).map(
          (item) => item.courseId
        );

        const courses = await prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: {
            id: true,
            subject: true,
            price: true,
            img: true,
            discountPercent: true,
          },
        });

        const items = courses.map((course) => ({
          courseId: course.id,
          title: course.subject,
          price: course.price,
          img: course.img,
          discountPercent: course.discountPercent,
        }));

        return {
          id: order.id,
          total: order.total,
          status: order.status,
          paymentRef: order.paymentRef,
          createdAt: order.createdAt,
          items,
          itemCount: items.length,
        };
      })
    );

    return NextResponse.json({
      ok: true,
      orders: ordersWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/user/orders] error:", error);
    return NextResponse.json(
      { ok: false, error: "خطایی در دریافت سفارشات رخ داد" },
      { status: 500 }
    );
  }
}
