import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
// import { sendSmsMelipayamak } from "@/lib/sms";

function generateOtpDigits(length = 4) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = body.phone ?? body.username;
    const password = body.password;

    if (!phone || !password)
      return NextResponse.json(
        { error: "phone and password required" },
        { status: 400 }
      );

    // بررسی: آیا کاربر تاییدشده وجود دارد؟
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser?.phoneVerified)
      return NextResponse.json(
        { error: "این شماره قبلاً ثبت شده است." },
        { status: 400 }
      );

    // هش کردن رمز و ذخیره موقت در جدول temp
    const hashedPassword = await bcrypt.hash(password, 10);

    // OTP جدید بساز و ذخیره کن
    const code = generateOtpDigits(4);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // دو دقیقه
    console.log("code: ", code);

    await prisma.otp.upsert({
      where: { phone },
      update: { code, expiresAt, createdAt: new Date() },
      create: { phone, code, expiresAt },
    });

    // ذخیره موقت کاربر (اگر نبود)
    await prisma.tempUser.upsert({
      where: { phone },
      update: { passwordHash: hashedPassword, createdAt: new Date() },
      create: { phone, passwordHash: hashedPassword },
    });
    // TODO add meliPayamak

    // ارسال پیامک
    // const text = `کد تایید شما: ${code}`;
    // try {
    //   await sendSmsMelipayamak(phone, text);
    // } catch (err) {
    //   console.error("SMS send failed:", err);
    //   return NextResponse.json({ error: "sms_failed" }, { status: 500 });
    // }

    return NextResponse.json({ message: "کد تایید ارسال شد." });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
