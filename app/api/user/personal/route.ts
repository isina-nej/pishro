// api/user/personal
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

// ✅ Update personal information
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const data = await req.json();
    const {
      firstName,
      lastName,
      phone,
      email,
      nationalCode,
      birthDate,
      avatarUrl,
    } = data;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        phone,
        email,
        nationalCode,
        birthDate: birthDate ? new Date(birthDate) : null,
        avatarUrl,
      },
    });

    return successResponse(updatedUser, "اطلاعات شخصی با موفقیت بروزرسانی شد");
  } catch (error) {
    console.error("Update personal info error:", error);
    return errorResponse(
      "خطایی در بروزرسانی اطلاعات شخصی رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
