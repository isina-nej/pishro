import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType, TransactionStatus } from "@prisma/client";
import { createEnrollmentsFromOrder } from "@/lib/helpers/transaction";
import { verifyPayment } from "@/lib/payment";

async function handleVerify(req: Request) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");
    // The order ID comes from our request callback URL; gateway callback parameters
    // are untrusted and must not override it.
    if (!orderId) return NextResponse.json({ error: "شناسه سفارش ارسال نشده است" }, { status: 400 });
    const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
    const rawBaseUrl =
      configuredBaseUrl ||
      (url.origin.startsWith("http") ? url.origin : "https://pishrosarmaye.com");
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? (rawBaseUrl.startsWith("https://") ? rawBaseUrl : rawBaseUrl.replace(/^http:\/\//, "https://"))
        : rawBaseUrl;
    const redirect = (result: "success" | "failed" | "pending") =>
      NextResponse.redirect(`${baseUrl}/checkout/result?result=${result}&orderId=${encodeURIComponent(orderId)}`);

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    if (order.status === "PAID") {
      if (order.userId) {
        try { await createEnrollmentsFromOrder(order.userId, orderId); }
        catch (error) { console.error("[PaymentVerify] Enrollment retry failed", error); return redirect("pending"); }
      }
      return redirect("success");
    }
    if (order.status === "FAILED") return redirect("failed");
    if (!order.paymentGateway || !order.paymentAuthority) return redirect("pending");

    const params: Record<string, string> = Object.fromEntries(url.searchParams);
    // Legacy gateways may POST form/JSON callbacks. Zibal uses GET query parameters.
    if (req.method === "POST" && order.paymentGateway !== "zibal") {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const body = await req.json();
        if (body && typeof body === "object" && !Array.isArray(body)) {
          for (const [key, value] of Object.entries(body)) {
            if (value !== null && value !== undefined) params[key] = String(value);
          }
        }
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const body = await req.formData();
        body.forEach((value, key) => { if (typeof value === "string") params[key] = value; });
      }
    }
    if (order.paymentGateway === "zibal" && params.trackId !== order.paymentAuthority) {
      return redirect("pending");
    }

    const result = await verifyPayment({
      orderId,
      amount: order.total,
      authority: order.paymentAuthority,
      params,
    }, order.paymentGateway);
    if (result.retryable) return redirect("pending");

    const status = result.success ? "PAID" : "FAILED";
    const refNumber = result.refNumber || order.paymentAuthority;
    // Lock the row; only one callback commits the transition and transaction.
    const changed = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM \`Order\` WHERE id = ${orderId} FOR UPDATE`;
      const current = await tx.order.findUnique({ where: { id: orderId }, select: { status: true } });
      if (current?.status !== "PENDING") return current?.status;
      await tx.order.update({
        where: { id: orderId },
        data: { status, ...(result.success ? { paymentRef: refNumber } : {}) },
      });
      if (order.userId) {
        await tx.transaction.create({
          data: {
            userId: order.userId,
            orderId,
            amount: order.total,
            type: TransactionType.PAYMENT,
            status: result.success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
            gateway: order.paymentGateway,
            ...(result.success ? { refNumber } : {}),
            description: result.success ? `پرداخت موفق سفارش از طریق ${order.paymentGateway}` : result.errorMessage || "پرداخت ناموفق",
          },
        });
      }
      return status;
    });
    if (changed === "PAID" && order.userId) {
      try {
        await createEnrollmentsFromOrder(order.userId, orderId);
      } catch (error) {
        console.error("[PaymentVerify] Enrollment failed", error);
        return redirect("pending");
      }
    }
    return redirect(changed === "PAID" ? "success" : changed === "FAILED" ? "failed" : "pending");
  } catch (error) {
    console.error("[PaymentVerify]", error);
    return NextResponse.json({ error: "تأیید پرداخت موقتاً در دسترس نیست؛ بعداً دوباره تلاش کنید" }, { status: 503 });
  }
}

export async function GET(req: Request) { return handleVerify(req); }
export async function POST(req: Request) { return handleVerify(req); }
