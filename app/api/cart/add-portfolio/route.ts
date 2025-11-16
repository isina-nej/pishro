import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("برای افزودن به سبد خرید باید وارد شوید");
    }

    const userId = session.user.id;

    // Parse request body
    const body = await req.json();
    const {
      portfolioType,
      portfolioAmount,
      portfolioDuration,
      expectedReturn,
      monthlyRate,
      price,
    } = body;

    // Validation
    if (!portfolioType || !portfolioAmount || !portfolioDuration || !price) {
      return errorResponse("اطلاعات ناقص است", "INVALID_INPUT");
    }

    if (!["low", "medium", "high"].includes(portfolioType)) {
      return errorResponse("نوع سبد نامعتبر است", "INVALID_PORTFOLIO_TYPE");
    }

    if (portfolioAmount < 1_000_000 || portfolioAmount > 5_000_000_000) {
      return errorResponse("مبلغ سرمایه‌گذاری نامعتبر است", "INVALID_AMOUNT");
    }

    if (portfolioDuration < 1 || portfolioDuration > 12) {
      return errorResponse("مدت سرمایه‌گذاری نامعتبر است", "INVALID_DURATION");
    }

    // Check if user already has a pending order with this portfolio
    const existingOrder = await prisma.order.findFirst({
      where: {
        userId: userId,
        status: "PENDING",
        orderItems: {
          some: {
            portfolioType: portfolioType,
            portfolioAmount: portfolioAmount,
            portfolioDuration: portfolioDuration,
          },
        },
      },
      include: {
        orderItems: true,
      },
    });

    if (existingOrder) {
      return errorResponse(
        "این سبد قبلاً به سبد خرید اضافه شده است",
        "DUPLICATE_ITEM"
      );
    }

    // Create a new order with the portfolio
    const order = await prisma.order.create({
      data: {
        userId: userId,
        total: price,
        status: "PENDING",
        items: {
          portfolioType,
          portfolioAmount,
          portfolioDuration,
          expectedReturn,
          monthlyRate,
          price,
        },
        orderItems: {
          create: {
            portfolioType,
            portfolioAmount,
            portfolioDuration,
            price,
          },
        },
      },
      include: {
        orderItems: true,
      },
    });

    return successResponse(
      {
        orderId: order.id,
        message: "سبد سرمایه‌گذاری با موفقیت به سبد خرید اضافه شد",
      },
      "سبد سرمایه‌گذاری اضافه شد"
    );
  } catch (error) {
    console.error("Error adding portfolio to cart:", error);
    return errorResponse(
      "خطا در افزودن سبد به سبد خرید",
      "INTERNAL_SERVER_ERROR"
    );
  }
}
