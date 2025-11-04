// app/api/otp/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { phone, code } = await req.json();
  if (!phone || !code)
    return NextResponse.json({ error: "missing" }, { status: 400 });

  const otp = await prisma.otp.findFirst({
    where: { phone, code },
    orderBy: { createdAt: "desc" },
  });

  if (!otp)
    return NextResponse.json({ error: "invalid_code" }, { status: 400 });
  if (otp.expiresAt < new Date()) {
    return NextResponse.json({ error: "expired" }, { status: 400 });
  }

  // mark user as verified (if user exists)
  const user = await prisma.user.findUnique({ where: { phone } });
  if (user) {
    await prisma.user.update({
      where: { phone },
      data: { phoneVerified: true },
    });
  }

  // optionally remove OTP
  await prisma.otp.deleteMany({ where: { phone } });

  return NextResponse.json({ ok: true });
}
