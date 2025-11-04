// app/api/otp/send/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSmsMelipayamak } from "@/lib/sms";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

export async function POST(req: Request) {
  const { phone } = await req.json();
  if (!phone)
    return NextResponse.json({ error: "phone required" }, { status: 400 });

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // save OTP
  await prisma.otp
    .create({
      // Prisma model name: Otp -> JS client has lowercase? adjust after generate
      data: {
        phone,
        code,
        expiresAt,
      },
    })
    .catch(console.error);

  // send SMS
  const text = `کد تایید شما: ${code}`;
  try {
    await sendSmsMelipayamak(phone, text);
  } catch (err) {
    console.error("SMS send failed:", err);
    return NextResponse.json({ error: "sms_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
