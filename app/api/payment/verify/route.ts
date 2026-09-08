// @/app/api/payment/verify/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType, TransactionStatus } from "@prisma/client";
import {
  createTransaction,
  createEnrollmentsFromOrder,
} from "@/lib/helpers/transaction";
// Zarinpal SDK removed — enable via official REST API when going live.

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");
    const orderId = searchParams.get("orderId");

    if (!orderId || !authority || !status) {
      return NextResponse.json(
        { error: "پارامترهای پرداخت ناقص است" },
        { status: 400 }
      );
    }

    // Order must belong to the signed-in buyer — blocks orderId guessing.
    const session = await auth();
    if (!session?.user?.id) {
      const base = process.env.NEXT_PUBLIC_BASE_URL;
      return NextResponse.redirect(
        `${base}/login?next=${encodeURIComponent(`/checkout/result?result=failed&orderId=${orderId}`)}`
      );
    }

    // 🔍 دریافت سفارش از دیتابیس
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }
    if (!order.userId || order.userId !== session.user.id) {
      return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }
    // Idempotent: already-finalized orders never flip again.
    if (order.status === "PAID") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result?result=success&orderId=${orderId}`
      );
    }
    if (order.status === "FAILED") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result?result=failed&orderId=${orderId}`
      );
    }

    // Fake gateway disabled in production — wire real Zarinpal verify + amount match here.
    if (process.env.NODE_ENV === "production") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result?result=failed&orderId=${orderId}`
      );
    }

    // 🧪 حالت تستی فقط در non-production (Fake response)
    if (status === "OK") {
      const refNumber = `TEST-${authority}`;

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID", paymentRef: refNumber },
      });

      // Create transaction record
      if (order.userId) {
        await createTransaction({
          userId: order.userId,
          orderId: order.id,
          amount: order.total,
          type: TransactionType.PAYMENT,
          status: TransactionStatus.SUCCESS,
          gateway: "zarinpal",
          refNumber,
          description: "پرداخت موفق سفارش",
        });

        // Create enrollments for purchased courses
        try {
          await createEnrollmentsFromOrder(order.userId, order.id);
        } catch (error) {
          console.error("Error creating enrollments:", error);
          // Don't fail the payment if enrollment creation fails
        }
      }

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result?result=success&orderId=${orderId}`
      );
    } else {
      // Update order status to failed
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });

      // Create failed transaction record
      if (order.userId) {
        await createTransaction({
          userId: order.userId,
          orderId: order.id,
          amount: order.total,
          type: TransactionType.PAYMENT,
          status: TransactionStatus.FAILED,
          gateway: "zarinpal",
          description: "پرداخت ناموفق",
        });
      }

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result?result=failed&orderId=${orderId}`
      );
    }
  } catch (err) {
    console.error("[Payment Verify Error]:", err);
    return NextResponse.json(
      { error: "خطایی در بررسی پرداخت رخ داد" },
      { status: 500 }
    );
  }
}
