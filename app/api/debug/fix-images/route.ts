import { execute, query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Update courses with proper image paths
    const updates = [
      {
        subject: "ارزهای دیجیتال و بلاک‌چین پیشرفته",
        img: "/images/crypto/landing-img.png",
      },
      {
        subject: "ایردراپ و کسب توکن رایگان",
        img: "/images/stock/stock-landing.jpg",
      },
      {
        subject: "آموزش کامل بورس برای مبتدیان",
        img: "/images/stock/stock-landing.jpg",
      },
      {
        subject: "تحلیل تکنیکال بورس",
        img: "/images/stock/stock-landing.jpg",
      },
      {
        subject: "NFT و توکن‌های دیجیتال",
        img: "/images/nft/nft.png",
      },
    ];

    let updated = 0;
    for (const update of updates) {
      try {
        const result = await execute(
          `UPDATE Course SET img = ? WHERE subject = ?`,
          [update.img, update.subject]
        );
        updated += result.affectedRows || 0;
      } catch (error) {
        console.error(`Error updating ${update.subject}:`, error);
      }
    }

    // Verify the updates
    const courses = await query<any>(
      `SELECT id, subject, img FROM Course ORDER BY createdAt DESC`
    );

    return NextResponse.json({
      success: true,
      updated,
      courses: courses.map((c) => ({
        subject: c.subject,
        img: c.img,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
