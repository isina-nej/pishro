import { execute, query } from "@/lib/db";
import { NextResponse } from "next/server";

function generateId() {
  // Generate a simple ID similar to CUID
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function GET() {
  try {
    console.log("🌱 Starting courses seed with local images...");

    // Step 1: Create categories with INSERT OR IGNORE
    const categoryData = [
      { slug: "stock", title: "بورس", description: "آموزش کامل معاملات و تحلیل بورس", icon: "📈", color: "#ec4899" },
      { slug: "cryptocurrency", title: "ارزهای دیجیتال", description: "آموزش جامع ارزهای دیجیتال و بلاک‌چین", icon: "🪙", color: "#6366f1" },
      { slug: "nft", title: "NFT", description: "آموزش NFT و دنیای هنر دیجیتال", icon: "🎨", color: "#f59e0b" },
    ];

    const categoryIds: Record<string, string> = {};

    for (const cat of categoryData) {
      try {
        // First check if exists
        const existing = await query<any>(
          "SELECT id FROM `Category` WHERE slug = ?",
          [cat.slug]
        );

        if (existing && existing[0]) {
          categoryIds[cat.slug] = existing[0].id;
          console.log(`✅ Category exists: ${cat.slug} (${existing[0].id})`);
        } else {
          // Create new category
          const id = generateId();
          await execute(
            `INSERT INTO \`Category\`(id, slug, title, description, icon, color) VALUES (?, ?, ?)`,
            [id, cat.slug, cat.title, cat.description, cat.icon, cat.color]
          );
          categoryIds[cat.slug] = id;
          console.log(`✅ Created category: ${cat.slug} (${id})`);
        }
      } catch (err: any) {
        console.error(`❌ Error with category ${cat.slug}:`, err.message);
      }
    }

    console.log(`📚 Category IDs:`, categoryIds);

    // Step 2: Create courses
    const courseData = [
      {
        subject: "آموزش کامل بورس برای مبتدیان",
        price: 299000,
        img: "/images/stock/stock-landing.jpg",
        description: "دوره جامع برای یادگیری بورس از صفر تا صد",
        discountPercent: 20,
        time: "12:00:00",
        students: 1250,
        videosCount: 45,
        instructor: "علی محمدی",
        slug: "stock-beginner",
        categorySlug: "stock",
        level: "BEGINNER",
      },
      {
        subject: "تحلیل تکنیکال بورس",
        price: 349000,
        img: "/images/stock/shivam.png",
        description: "آموزش تحلیل تکنیکال و الگوهای قیمتی",
        discountPercent: 10,
        time: "16:00:00",
        students: 980,
        videosCount: 52,
        instructor: "مریم رضایی",
        slug: "technical-analysis",
        categorySlug: "stock",
        level: "INTERMEDIATE",
      },
      {
        subject: "ارزهای دیجیتال و بلاک‌چین پیشرفته",
        price: 399000,
        img: "/images/crypto/landing-img.png",
        description: "دوره پیشرفته برای سرمایه‌گذاران حرفه‌ای",
        discountPercent: 15,
        time: "20:00:00",
        students: 850,
        videosCount: 60,
        instructor: "فرزاد احمدی",
        slug: "crypto-advanced",
        categorySlug: "cryptocurrency",
        level: "ADVANCED",
      },
      {
        subject: "NFT و توکن‌های دیجیتال",
        price: 279000,
        img: "/images/nft/nft.png",
        description: "دوره کامل درباره NFT و هنر دیجیتال",
        discountPercent: 25,
        time: "10:00:00",
        students: 650,
        videosCount: 35,
        instructor: "سارا کریمی",
        slug: "nft-tokens",
        categorySlug: "nft",
        level: "BEGINNER",
      },
      {
        subject: "نقشه‌برداری NFT و هنر دیجیتال",
        price: 349000,
        img: "/images/nft/chart.png",
        description: "آموزش ایجاد و فروش NFT‌های دیجیتالی",
        discountPercent: 5,
        time: "14:00:00",
        students: 420,
        videosCount: 40,
        instructor: "علی کریمی",
        slug: "nft-advanced",
        categorySlug: "nft",
        level: "INTERMEDIATE",
      },
    ];

    const createdCourses = [];

    for (const course of courseData) {
      try {
        const categoryId = categoryIds[course.categorySlug];
        if (!categoryId) {
          console.error(`❌ Category not found for ${course.slug}`);
          continue;
        }

        // Check if course exists
        const existing = await query<any>(
          "SELECT id FROM `Course` WHERE slug = ?",
          [course.slug]
        );

        if (existing && existing[0]) {
          console.log(`✅ Course already exists: ${course.slug}`);
          createdCourses.push({ slug: course.slug, subject: course.subject, img: course.img });
        } else {
          const id = generateId();
          await execute(
            `INSERT INTO \`Course\`(id, subject, price, img, description, discountPercent, time, students, videosCount, instructor, slug, categoryId, level, published, status) VALUES (?, ?, ?)`,
            [
              id,
              course.subject,
              course.price,
              course.img,
              course.description,
              course.discountPercent,
              course.time,
              course.students,
              course.videosCount,
              course.instructor,
              course.slug,
              categoryId,
              course.level,
              true, // published
              "ACTIVE", // status
            ]
          );
          console.log(`✅ Created course: ${course.subject}`);
          createdCourses.push({ slug: course.slug, subject: course.subject, img: course.img });
        }
      } catch (err: any) {
        console.error(`❌ Error with course ${course.slug}:`, err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "✅ Seed completed successfully!",
      stats: {
        categories: Object.keys(categoryIds).length,
        courses: createdCourses.length,
        courses_list: createdCourses.map((c) => ({
          subject: c.subject,
          image: c.img,
          hasImage: !!c.img,
        })),
      },
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
