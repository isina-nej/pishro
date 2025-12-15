// api/user/pay
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

// ✅ Update pay info
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const { cardNumber, shebaNumber, accountOwner } = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        cardNumber,
        shebaNumber,
        accountOwner,
      },
    });

    return successResponse(
      {
        card: user.cardNumber,
        shba: user.shebaNumber,
        owner: user.accountOwner,
      },
      "اطلاعات پرداخت با موفقیت بروزرسانی شد"
    );
  } catch (error) {
    console.error("Pay info update error:", error);
    return errorResponse(
      "خطایی در بروزرسانی اطلاعات پرداخت رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
