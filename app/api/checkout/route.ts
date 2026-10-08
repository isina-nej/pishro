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

    // Reject malformed/duplicated IDs before consulting the database.
    if (!Array.isArray(items) || items.length === 0 || items.length > 50 ||
        items.some((item) => !item || typeof item.courseId !== "string" || !item.courseId.trim()) ||
        new Set(items.map((item) => item.courseId)).size !== items.length) {
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
      select: { id: true, subject: true, price: true, discountPercent: true },
    });

    if (courses.length !== items.length) {
      return validationError(
        { courses: "دوره‌ای با شناسه‌های ارسالی یافت نشد" },
        "دوره‌ای یافت نشد"
      );
    }

    // 🔒 Guard: check if user is already enrolled in any of these courses
    const existingEnrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        courseId: { in: courseIds },
      },
      select: {
        course: { select: { subject: true } },
      },
    });

    if (existingEnrollments.length > 0) {
      const names = existingEnrollments.map((e) => `«${e.course.subject}»`).join("، ");
      return validationError(
        { courses: `شما قبلاً در ${names} ثبت‌نام کرده‌اید و نیازی به خرید مجدد نیست` },
        "دوره قبلاً خریداری شده است"
      );
    }

    // 🧮 Calculate total from real DB data (with discount applied)
    const total = courses.reduce((sum: number, course) => {
      const finalPrice = course.discountPercent
        ? Math.round(course.price * (1 - course.discountPercent / 100))
        : course.price;
      return sum + finalPrice;
    }, 0);

    if (!Number.isSafeInteger(total) || total <= 100) {
      return validationError({ amount: "مبلغ سفارش معتبر نیست یا کمتر از حداقل زیبال است" });
    }

    // Resolve public base URL with fallback to production origin
    const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
    const reqOrigin = req.headers.get("origin")?.replace(/\/$/, "");
    const rawBaseUrl =
      configuredBaseUrl ||
      (reqOrigin && reqOrigin.startsWith("http") ? reqOrigin : "https://pishrosarmaye.com");
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? (rawBaseUrl.startsWith("https://") ? rawBaseUrl : rawBaseUrl.replace(/^http:\/\//, "https://"))
        : rawBaseUrl;

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
              discountPercent: course.discountPercent || 0,
            };
          }),
        },
      },
    });

    console.log(`[Checkout] Order ${order.id} created. Total: ${total}`);

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
      await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
      return errorResponse(
        paymentResult.errorMessage || "خطا در اتصال به درگاه پرداخت",
        ErrorCodes.PAYMENT_FAILED,
        undefined,
        400
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
