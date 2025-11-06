// @/app/api/user/transactions/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ✅ Get user's transactions
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type"); // "payment", "refund", "withdrawal"
    const status = searchParams.get("status"); // "pending", "success", "failed"
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId: session.user.id };
    if (type) where.type = type;
    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          order: {
            select: {
              id: true,
              total: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      gateway: transaction.gateway,
      refNumber: transaction.refNumber,
      description: transaction.description,
      createdAt: transaction.createdAt,
      order: transaction.order,
    }));

    return NextResponse.json({
      ok: true,
      transactions: formattedTransactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/user/transactions] error:", error);
    return NextResponse.json(
      { ok: false, error: "خطایی در دریافت تراکنش‌ها رخ داد" },
      { status: 500 }
    );
  }
}
