// app/api/otp/send/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSmsMelipayamak } from "@/lib/sms";

function generateOtpDigits(length = 4) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone)
      return NextResponse.json({ error: "phone required" }, { status: 400 });

    const code = generateOtpDigits(4);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // save OTP
    await prisma.otp.create({
      data: { phone, code, expiresAt },
    });

    // send SMS
    const text = `کد تایید شما: ${code}`;
    try {
      await sendSmsMelipayamak(phone, text);
    } catch (err) {
      console.error("SMS send failed:", err);
      return NextResponse.json({ error: "sms_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("otp send error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
