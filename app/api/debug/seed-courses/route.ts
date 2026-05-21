import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get or create categories first
    const categoryData = [
      {
        slug: "cryptocurrency",
        title: "ارزهای دیجیتال",
        description: "آموزش جامع ارزهای دیجیتال و بلاک‌چین",
        color: "#6366f1",
        icon: "🪙",
      },
      {
        slug: "stock",
        title: "بورس",
        description: "آموزش کامل معاملات و تحلیل بورس",
        color: "#ec4899",
        icon: "📈",
      },
      {
        slug: "nft",
        title: "NFT",
        description: "آموزش NFT و دنیای هنر دیجیتال",
        color: "#f59e0b",
        icon: "🎨",
      },
      {
        slug: "trading",
        title: "معاملات",
        description: "آموزش معاملات و تحلیل تکنیکال",
        color: "#10b981",
        icon: "💹",
      },
    ];

    // Create or update categories
    const categories: any[] = [];
    for (const cat of categoryData) {
      try {
        const created = await prisma.category.upsert({
          where: { slug: cat.slug },
          update: {
            title: cat.title,
            description: cat.description,
            color: cat.color,
            icon: cat.icon,
          },
          create: {
            slug: cat.slug,
            title: cat.title,
            description: cat.description,
            color: cat.color,
            icon: cat.icon,
          },
        });
        categories.push(created);
      } catch (err) {
        console.error(`Error with category ${cat.slug}:`, err);
      }
    }

    // Course data with images
    const courseData: any = [
      {
        subject: "آموزش کامل بورس برای مبتدیان",
        price: 299000,
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        description: "دوره جامع برای یادگیری بورس از صفر تا صد",
        discountPercent: 20,
        time: "12:00:00",
        students: 1250,
        videosCount: 45,
        instructor: "علی محمدی",
        slug: "stock-beginner",
        categorySlug: "stock",
        level: "BEGINNER",
        learningGoals: ["مبانی بورس", "تحلیل شمعی", "مدیریت ریسک"],
      },
      {
        subject: "ارزهای دیجیتال و بلاک‌چین پیشرفته",
        price: 399000,
        img: "https://images.unsplash.com/photo-1605559424843-9e4c3ff86e00?w=500&h=300&fit=crop",
        description: "دوره پیشرفته برای سرمایه‌گذاران حرفه‌ای",
        discountPercent: 15,
        time: "20:00:00",
        students: 850,
        videosCount: 60,
        instructor: "فرزاد احمدی",
        slug: "crypto-advanced",
        categorySlug: "cryptocurrency",
        level: "ADVANCED",
        learningGoals: ["بلاک‌چین", "هوشمند قرارداد", "تحلیل بنیادی"],
      },
      {
        subject: "تحلیل تکنیکال بورس",
        price: 349000,
        img: "https://images.unsplash.com/photo-1569163139394-de4798aa62b3?w=500&h=300&fit=crop",
        description: "آموزش تحلیل تکنیکال و الگوهای قیمتی",
        discountPercent: 10,
        time: "16:00:00",
        students: 980,
        videosCount: 52,
        instructor: "مریم رضایی",
        slug: "technical-analysis",
        categorySlug: "stock",
        level: "INTERMEDIATE",
        learningGoals: ["الگوهای قیمتی", "اندیکاتورها", "سطوح حمایتی"],
      },
      {
        subject: "NFT و توکن‌های دیجیتال",
        price: 279000,
        img: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
        description: "دوره کامل درباره NFT و هنر دیجیتال",
        discountPercent: 25,
        time: "10:00:00",
        students: 650,
        videosCount: 35,
        instructor: "سارا کریمی",
        slug: "nft-tokens",
        categorySlug: "nft",
        level: "BEGINNER",
        learningGoals: ["ایجاد NFT", "بازار NFT", "قراردادهای هوشمند"],
      },
      {
        subject: "معاملات الگوریتمی",
        price: 449000,
        img: "https://images.unsplash.com/photo-1526374965328-7f5ae4e8cfb6?w=500&h=300&fit=crop",
        description: "آموزش ربات‌های معاملاتی و خودکاری",
        discountPercent: 0,
        time: "18:00:00",
        students: 450,
        videosCount: 48,
        instructor: "حسن پور",
        slug: "algo-trading",
        categorySlug: "trading",
        level: "ADVANCED",
        learningGoals: ["پایتون", "API", "استراتژی‌های معاملاتی"],
      },
    ];

    // Create or update courses
    const courses: any[] = [];
    for (const course of courseData) {
      if (!categories || categories.length === 0) {
        console.error("No categories available");
        continue;
      }

      const category = categories.find((c) => c.slug === course.categorySlug);
      const categoryId = category ? category.id : categories[0].id;

      const created = await prisma.course.upsert({
        where: { slug: course.slug },
        update: {
          subject: course.subject,
          price: course.price,
          img: course.img,
          description: course.description,
          discountPercent: course.discountPercent,
          time: course.time,
          students: course.students,
          videosCount: course.videosCount,
          instructor: course.instructor,
          level: course.level as any,
          learningGoals: course.learningGoals,
          categoryId: categoryId,
        },
        create: {
          subject: course.subject,
          price: course.price,
          img: course.img,
          description: course.description,
          discountPercent: course.discountPercent,
          time: course.time,
          students: course.students,
          videosCount: course.videosCount,
          instructor: course.instructor,
          slug: course.slug,
          level: course.level as any,
          learningGoals: course.learningGoals,
          categoryId: categoryId,
          published: true,
          status: "ACTIVE",
        },
      });
      courses.push(created);
    }

    return NextResponse.json({
      success: true,
      message: "✅ Seeding completed successfully!",
      stats: {
        categories: categories.length,
        courses: courses.length,
        details: {
          categories: categories.map((c) => c.title),
          courses: courses.map((c) => ({ subject: c.subject, hasImage: !!c.img })),
        },
      },
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
