// app/api/checkout/route.ts
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getZarinpalMerchantId } from "@/lib/services/settings-service";
// Zarinpal SDK removed — enable via official REST API when going live.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, items, _callbackUrl } = body;

    // ✅ Validate input
    if (!userId || !items || items.length === 0) {
      return validationError(
        {
          userId: !userId ? "شناسه کاربر الزامی است" : [],
          items: !items || items.length === 0 ? "آیتم‌های سفارش الزامی است" : [],
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

    // 💳 حالت واقعی (فعلاً کامنت شده)
    /*
    // Get merchant ID from database settings (with fallback to env)
    const merchantId = await getZarinpalMerchantId();
    if (!merchantId) {
      return errorResponse(
        "تنظیمات درگاه پرداخت ناقص است",
        ErrorCodes.DATABASE_ERROR
      );
    }

    const zarinpal = Zarinpal.create(merchantId, true);
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/verify?orderId=${order.id}`;

    const paymentRes = await zarinpal.PaymentRequest({
      Amount: total,
      CallbackURL: callbackUrl,
      Description: `پرداخت سفارش ${order.id}`,
    });

    if (paymentRes.status === 100) {
      const payUrl = `https://www.zarinpal.com/pg/StartPay/${paymentRes.authority}`;
      return successResponse(
        {
          orderId: order.id,
          payUrl,
          total,
        },
        "سفارش با موفقیت ایجاد شد"
      );
    } else {
      return errorResponse(
        "خطا در ایجاد درخواست پرداخت",
        ErrorCodes.PAYMENT_ERROR
      );
    }
    */

    // ⚠️ حالت تستی (Fake payment URL)
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
