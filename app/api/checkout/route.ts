// app/api/checkout/route.ts
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
  successResponse,
  validationError,
  unauthorizedResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { initiatePayment } from "@/lib/payment";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("لطفاً وارد شوید");
    }
    const userId = session.user.id;

    const body = await req.json();
    const { items } = body;

    // ✅ Validate input
    if (!items || items.length === 0) {
      return validationError(
        {
          items: "آیتم‌های سفارش الزامی است",
        },
        "اطلاعات ارسالی ناقص است"
      );
    }

    // ✅ Extract all course IDs
    const courseIds = items.map((item: { courseId: string }) => item.courseId);

    // ✅ Fetch courses from DB
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, price: true, discountPercent: true },
    });

    if (courses.length === 0) {
      return validationError(
        { courses: "دوره‌ای با شناسه‌های ارسالی یافت نشد" },
        "دوره‌ای یافت نشد"
      );
    }

    // 🧮 Calculate total from real DB data (with discount applied)
    const total = courses.reduce((sum: number, course) => {
      const finalPrice = course.discountPercent
        ? Math.round(course.price * (1 - course.discountPercent / 100))
        : course.price;
      return sum + finalPrice;
    }, 0);

    // ✅ Create order in DB with OrderItems
    const order = await prisma.order.create({
      data: {
        userId,
        items: courses.map((c) => ({ courseId: c.id })), // stored as JSON
        total,
        status: "PENDING",
        orderItems: {
          create: courses.map((course) => {
            const finalPrice = course.discountPercent
              ? Math.round(course.price * (1 - course.discountPercent / 100))
              : course.price;
            return {
              courseId: course.id,
              price: finalPrice,
              discount: course.discountPercent || 0,
            };
          }),
        },
      },
    });

    console.log(`[Checkout] Order ${order.id} created. Total: ${total}`);

    // Determine Base URL for callback
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
    const callbackUrl = `${baseUrl}/api/payment/verify?orderId=${order.id}`;

    // Get user info if available
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, email: true },
    });

    // Request payment via configured gateway
    const paymentResult = await initiatePayment({
      orderId: order.id,
      amount: total,
      callbackUrl,
      description: `پرداخت سفارش دوره ${order.id}`,
      mobile: user?.phone || undefined,
      email: user?.email || undefined,
    });

    if (!paymentResult.success || !paymentResult.payUrl) {
      return errorResponse(
        paymentResult.errorMessage || "خطا در اتصال به درگاه پرداخت",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    // Save gateway & authority on order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentGateway: paymentResult.gateway,
        paymentAuthority: paymentResult.authority,
      },
    });

    return successResponse(
      {
        orderId: order.id,
        payUrl: paymentResult.payUrl,
        total,
      },
      "سفارش با موفقیت ایجاد شد"
    );
  } catch (err) {
    console.error("[Checkout POST error]:", err);
    return errorResponse(
      "خطایی در پردازش سفارش رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
