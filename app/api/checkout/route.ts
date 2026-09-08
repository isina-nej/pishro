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
// Zarinpal SDK removed — enable via official REST API when going live.

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

    // Fake gateway disabled in production — real Zarinpal PaymentRequest wiring goes here.
    if (process.env.NODE_ENV === "production") {
      return errorResponse(
        "درگاه پرداخت فعال نیست",
        ErrorCodes.INTERNAL_ERROR
      );
    }

    // ⚠️ حالت تستی فقط در non-production (Fake payment URL)
    const fakePayUrl = `https://sandbox.zarinpal.com/pg/StartPay/fake-${order.id}`;

    return successResponse(
      {
        orderId: order.id,
        payUrl: fakePayUrl,
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
