// app/api/newsletter/subscribe/route.ts
import { PrismaClient, Prisma } from "@prisma/client";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { phone } = await req.json();
  
  if (!phone) {
    return validationError(
      { phone: "شماره تلفن الزامی است" },
      "شماره تلفن الزامی است"
    );
  }

  try {
    const sub = await prisma.newsletterSubscriber.create({ data: { phone } });
    return successResponse(
      { subId: sub.id },
      "با موفقیت در خبرنامه مشترک شدید"
    );
  } catch (err) {
    // ✅ Type narrowing for Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        // unique constraint violation
        return successResponse(
          { alreadySubscribed: true },
          "شما قبلاً در خبرنامه مشترک شده‌اید"
        );
      }
    }

    console.error("Database error:", err);
    return errorResponse(
      "خطایی در ثبت اشتراک رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
