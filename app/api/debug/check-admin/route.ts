import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test if Prisma can connect and find the user
    const user = await prisma.user.findUnique({
      where: { phone: "09123456789" },
      select: {
        id: true,
        phone: true,
        passwordHash: true,
        role: true,
        phoneVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found in database",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        phoneVerified: user.phoneVerified,
        hashLength: user.passwordHash.length,
        hashPreview: user.passwordHash.substring(0, 20) + "..."
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
