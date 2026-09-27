// app/api/payment/verify/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType, TransactionStatus } from "@prisma/client";
import {
  createTransaction,
  createEnrollmentsFromOrder,
} from "@/lib/helpers/transaction";
import { verifyPayment } from "@/lib/payment";

async function extractParams(req: Request): Promise<Record<string, string>> {
  const url = new URL(req.url);
  const params: Record<string, string> = {};

  // Extract from query string
  url.searchParams.forEach((val, key) => {
    params[key] = val;
  });

  // Extract from body if POST
  if (req.method === "POST") {
    try {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const json = await req.json();
        Object.entries(json).forEach(([k, v]) => {
          if (v !== undefined && v !== null) params[k] = String(v);
        });
      } else if (
        contentType.includes("application/x-www-form-urlencoded") ||
        contentType.includes("multipart/form-data")
      ) {
        const formData = await req.formData();
        formData.forEach((val, key) => {
          if (typeof val === "string") params[key] = val;
        });
      }
    } catch (err) {
      console.warn("[PaymentVerify] Body parse warning:", err);
    }
  }

  return params;
}

async function handleVerify(req: Request) {
  try {
    const params = await extractParams(req);

    const authority =
      params.Authority ||
      params.authority ||
      params.trackId ||
      params.trans_id ||
      params.token ||
      "";

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    let orderId = params.orderId || params.order_id || params.OrderId || "";

    // If orderId is missing, attempt lookup by paymentAuthority
    if (!orderId && authority) {
      const foundOrder = await prisma.order.findFirst({
        where: { paymentAuthority: authority },
      });
      if (foundOrder) {
        orderId = foundOrder.id;
      }
    }

    if (!orderId) {
      return NextResponse.json(
        { error: "شناسه سفارش در اطلاعات بازگشتی درگاه یافت نشد" },
        { status: 400 }
      );
    }

    // Fetch order from DB
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }

    // Optional user verification if signed in
    const session = await auth();
    if (session?.user?.id && order.userId && order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز به سفارش" },
        { status: 403 }
      );
    }

    // Idempotent: already-finalized orders
    if (order.status === "PAID") {
      return NextResponse.redirect(
        `${baseUrl}/checkout/result?result=success&orderId=${orderId}`
      );
    }
    if (order.status === "FAILED") {
      return NextResponse.redirect(
        `${baseUrl}/checkout/result?result=failed&orderId=${orderId}`
      );
    }

    // Verify payment using modular gateway system
    const verifyResult = await verifyPayment(
      {
        orderId: order.id,
        amount: order.total,
        authority: order.paymentAuthority || authority,
        params,
      },
      order.paymentGateway || undefined
    );

    const gatewayName = order.paymentGateway || "payment_gateway";

    if (verifyResult.success) {
      const refNumber = verifyResult.refNumber || `REF-${Date.now()}`;

      // Update order to PAID
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentRef: refNumber,
        },
      });

      // Record successful transaction
      if (order.userId) {
        await createTransaction({
          userId: order.userId,
          orderId: order.id,
          amount: order.total,
          type: TransactionType.PAYMENT,
          status: TransactionStatus.SUCCESS,
          gateway: gatewayName,
          refNumber,
          description: `پرداخت موفق سفارش از طریق ${gatewayName}`,
        });

        // Grant access / create enrollments
        try {
          await createEnrollmentsFromOrder(order.userId, order.id);
        } catch (enrollErr) {
          console.error("[PaymentVerify] Enrollment error:", enrollErr);
        }
      }

      return NextResponse.redirect(
        `${baseUrl}/checkout/result?result=success&orderId=${orderId}`
      );
    } else {
      // Mark order FAILED
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });

      // Record failed transaction
      if (order.userId) {
        await createTransaction({
          userId: order.userId,
          orderId: order.id,
          amount: order.total,
          type: TransactionType.PAYMENT,
          status: TransactionStatus.FAILED,
          gateway: gatewayName,
          description: verifyResult.errorMessage || "پرداخت ناموفق یا لغوشده",
        });
      }

      return NextResponse.redirect(
        `${baseUrl}/checkout/result?result=failed&orderId=${orderId}`
      );
    }
  } catch (err: unknown) {
    console.error("[PaymentVerify Handler Error]:", err);
    return NextResponse.json(
      { error: "خطایی در بررسی و تأیید پرداخت رخ داد" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return handleVerify(req);
}

export async function POST(req: Request) {
  return handleVerify(req);
}
