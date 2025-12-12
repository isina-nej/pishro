import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addCategories() {
  console.log("🔄 Adding categories...");

  try {
    const categories = [
      {
        slug: "cryptocurrency",
        title: "کریپتو",
        description: "دوره‌های آموزش کریپتو و بلاکچین",
        coverImage: "/images/categories/crypto.jpg",
        color: "#F59E0B",
        published: true,
      },
      {
        slug: "stock-market",
        title: "بورس و سهام",
        description: "آموزش بورس و بازار سهام",
        coverImage: "/images/categories/stock.jpg",
        color: "#10B981",
        published: true,
      },
      {
        slug: "business-consulting",
        title: "مشاوره کسب‌وکار",
        description: "مشاوره‌های تخصصی برای تجار و کسب‌وکارها",
        coverImage: "/images/categories/business.jpg",
        color: "#8B5CF6",
        published: true,
      },
      {
        slug: "investment-plans",
        title: "سبد‌های سرمایه‌گذاری",
        description: "سبد‌های آماده سرمایه‌گذاری برای سرمایه‌گذاران",
        coverImage: "/images/categories/investment.jpg",
        color: "#EC4899",
        published: true,
      },
    ];

    for (const cat of categories) {
      try {
        // بررسی وجود
        const existing = await prisma.category.findUnique({
          where: { slug: cat.slug },
        });

        if (existing) {
          // بروزرسانی
          await prisma.category.update({
            where: { slug: cat.slug },
            data: cat,
          });
          console.log(`✓ بروزرسانی: ${cat.title}`);
        } else {
          // ایجاد جدید
          await prisma.category.create({
            data: cat,
          });
          console.log(`✓ ایجاد: ${cat.title}`);
        }
      } catch (err) {
        console.error(`✗ خطا در ${cat.title}:`, err instanceof Error ? err.message : err);
      }
    }

    console.log("");
    console.log("✅ اضافه کردن دسته‌بندی‌ها تکمیل شد!");

    // نمایش دسته‌بندی‌های نهایی
    const all = await prisma.category.findMany();
    console.log(`📊 تعداد دسته‌بندی‌ها: ${all.length}`);
  } catch (error) {
    console.error("❌ خطا:", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addCategories();
