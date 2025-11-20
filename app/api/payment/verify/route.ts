// @/app/api/payment/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createTransaction,
  createEnrollmentsFromOrder,
} from "@/lib/helpers/transaction";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getZarinpalMerchantId } from "@/lib/services/settings-service";
// import Zarinpal from "zarinpal-nodejs"; // (در آینده فعال می‌شود)

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

    // 🔍 دریافت سفارش از دیتابیس
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }

    // 💳 حالت واقعی (فعلاً کامنت شده)
    /*
    // Get merchant ID from database settings (with fallback to env)
    const merchantId = await getZarinpalMerchantId();
    if (!merchantId) {
      console.error("Zarinpal Merchant ID not configured");
      return NextResponse.json(
        { error: "تنظیمات درگاه پرداخت ناقص است" },
        { status: 500 }
      );
    }

    const zarinpal = Zarinpal.create(merchantId, true);
    const verifyRes = await zarinpal.PaymentVerification({
      Amount: order.total,
      Authority: authority,
    });

    if (verifyRes.Status === 100) {
      // ✅ موفق
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentRef: verifyRes.RefID?.toString(),
        },
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result?result=success&orderId=${orderId}`
      );
    } else {
      // ❌ ناموفق
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result?result=failed&orderId=${orderId}`
      );
    }
    */

    // 🧪 حالت تستی (Fake response)
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
          type: "PAYMENT",
          status: "SUCCESS",
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
          type: "PAYMENT",
          status: "FAILED",
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
