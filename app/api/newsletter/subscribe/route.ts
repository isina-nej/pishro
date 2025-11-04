// app/api/newsletter/subscribe/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client"; // ✅ import Prisma types
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { phone } = await req.json();
  if (!phone)
    return NextResponse.json({ error: "phone required" }, { status: 400 });

  try {
    const sub = await prisma.newsletterSubscriber.create({ data: { phone } });
    return NextResponse.json({ ok: true, subId: sub.id });
  } catch (err) {
    // ✅ Type narrowing for Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        // unique constraint violation
        return NextResponse.json({ ok: true, message: "already_subscribed" });
      }
    }

    console.error("Database error:", err);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}
