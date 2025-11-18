import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 شروع seed ساده...");

  // 1. ایجاد یک کاربر تست (در صورت عدم وجود)
  const testUser = await prisma.user.upsert({
    where: { phone: "09123456789" },
    update: {},
    create: {
      phone: "09123456789",
      passwordHash:
        "$2a$10$YourHashedPasswordHere1234567890", // فقط برای تست
      phoneVerified: true,
      role: "USER",
      firstName: "کاربر",
      lastName: "تست",
    },
  });
  console.log("✓ کاربر تست ایجاد شد:", testUser.phone);

  // 2. ایجاد یک دوره
  const course = await prisma.course.create({
    data: {
      subject: "آموزش تحلیل تکنیکال",
      price: 500000,
      img: "/images/courses/placeholder.png",
      rating: 4.5,
      description:
        "دوره جامع آموزش تحلیل تکنیکال برای بازار ارزهای دیجیتال و بورس",
      discountPercent: 10,
      time: "8 ساعت",
      students: 120,
      videosCount: 3,
      level: "BEGINNER",
      language: "FA",
      instructor: "استاد محمدی",
      status: "ACTIVE",
      published: true,
      featured: true,
      slug: "technical-analysis-basics",
      prerequisites: ["آشنایی اولیه با بازارهای مالی"],
      learningGoals: [
        "شناخت الگوهای نموداری",
        "استفاده از اندیکاتورها",
        "تحلیل روندها",
      ],
    },
  });
  console.log("✓ دوره ایجاد شد:", course.subject, `(ID: ${course.id})`);

  // 3. ایجاد کلاس‌ها (Lessons) برای دوره
  const lesson1 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      title: "مقدمه‌ای بر تحلیل تکنیکال",
      description:
        "در این جلسه با مفاهیم پایه تحلیل تکنیکال آشنا می‌شوید",
      videoUrl: "https://example.com/videos/lesson1.mp4",
      thumbnail: "/images/lessons/lesson1-thumb.jpg",
      duration: "45:30",
      order: 1,
      published: true,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      title: "شناخت الگوهای نموداری",
      description: "آموزش الگوهای کلاسیک نموداری مانند سر و شانه، مثلث و...",
      videoUrl: "https://example.com/videos/lesson2.mp4",
      thumbnail: "/images/lessons/lesson2-thumb.jpg",
      duration: "52:15",
      order: 2,
      published: true,
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      title: "کار با اندیکاتورها",
      description: "آموزش کار با RSI، MACD، و سایر اندیکاتورهای پرکاربرد",
      videoUrl: "https://example.com/videos/lesson3.mp4",
      thumbnail: "/images/lessons/lesson3-thumb.jpg",
      duration: "1:05:20",
      order: 3,
      published: true,
    },
  });

  console.log("✓ تعداد 3 کلاس ایجاد شد");
  console.log(`  - ${lesson1.title} (ID: ${lesson1.id})`);
  console.log(`  - ${lesson2.title} (ID: ${lesson2.id})`);
  console.log(`  - ${lesson3.title} (ID: ${lesson3.id})`);

  // 4. ثبت‌نام کاربر در دوره
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: testUser.id,
      courseId: course.id,
      progress: 30, // 30% پیشرفت
    },
  });
  console.log("✓ ثبت‌نام کاربر در دوره انجام شد");

  console.log("\n✅ Seed کامل شد!");
  console.log("\n📋 اطلاعات:");
  console.log(`  - کاربر: ${testUser.phone}`);
  console.log(`  - دوره: ${course.subject}`);
  console.log(`  - تعداد کلاس‌ها: 3`);
  console.log("\n📝 برای تست:");
  console.log(`  1. با شماره ${testUser.phone} وارد شوید`);
  console.log("  2. به صفحه پروفایل بروید");
  console.log("  3. دوره خود را مشاهده کنید و روی آن کلیک کنید");
  console.log(
    `\n⚠️  توجه: در حال حاضر لینک دوره به /class/${course.id} اشاره می‌کند`
  );
  console.log(
    `   اما باید به اولین کلاس یعنی /class/${lesson1.id} اشاره کند`
  );
  console.log(
    "   این مشکل را در کد enrolledCourses.tsx باید برطرف کنید."
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ خطا در seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
