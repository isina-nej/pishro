import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();
    if (!phone || !code)
      return NextResponse.json({ error: "missing" }, { status: 400 });

    const otp = await prisma.otp.findUnique({ where: { phone } });
    if (!otp || otp.code !== code)
      return NextResponse.json({ error: "invalid_code" }, { status: 400 });

    if (otp.expiresAt < new Date())
      return NextResponse.json({ error: "expired" }, { status: 400 });

    // کاربر موقت را پیدا کن
    const temp = await prisma.tempUser.findUnique({ where: { phone } });
    if (!temp)
      return NextResponse.json(
        { error: "temporary user not found" },
        { status: 400 }
      );

    // بررسی اینکه آیا کاربر واقعی قبلاً ساخته شده یا نه
    const existingUser = await prisma.user.findUnique({ where: { phone } });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          phone,
          passwordHash: temp.passwordHash,
          phoneVerified: true,
        },
      });
    } else {
      await prisma.user.update({
        where: { phone },
        data: { phoneVerified: true },
      });
    }

    // پاکسازی رکوردهای موقت
    await prisma.otp.delete({ where: { phone } });
    await prisma.tempUser.delete({ where: { phone } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("otp verify error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
