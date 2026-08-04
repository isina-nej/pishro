/**
 * Seed featured home testimonials (Comment rows used by TestimonialsSection).
 * Kept as landing CMS content — not transactional demo noise.
 */

import { PrismaClient, UserRoleType } from "@prisma/client";

const prisma = new PrismaClient();

const testimonials = [
  {
    userName: "آزاده بهرامی",
    userAvatar: "/images/home/real-comments/1.jpg",
    userRole: UserRoleType.STUDENT,
    text: "خیلی خوشحالم ازینکه حدود ۲ سال پیش با این مجموعه خصوصا خانم دکتر عزیز آشنا شدم. کلاس‌های ایشون بسیار پربار و عالی بود. همچنین پشتیبانی ایشون بعد از اتمام کلاس بسیار انگیزه و اعتمادبه‌نفس به دوره‌آموزان میده.",
    rating: 10,
    published: true,
    verified: true,
    featured: true,
    views: 520,
  },
  {
    userName: "محمدجواد نوری",
    userAvatar: "/images/home/real-comments/2.jpg",
    userRole: UserRoleType.PROFESSIONAL_TRADER,
    text: "دوره عالی و کاملی بود. از مفاهیم پایه تا پیشرفته همه چیز به صورت کاملا عملی و کاربردی آموزش داده شد. الان توی بازار فعالیت دارم و از دانشی که کسب کردم استفاده می‌کنم.",
    rating: 10,
    published: true,
    verified: true,
    featured: true,
    views: 380,
  },
  {
    userName: "امیرحسین محمدزاده",
    userAvatar: "/images/home/real-comments/3.jpg",
    userRole: UserRoleType.STUDENT,
    text: "من قبل از شرکت در این دوره هیچ اطلاعاتی از بازار نداشتم. الان با اطمینان می‌تونم تحلیل کنم و معامله انجام بدم. واقعا ممنونم از تیم پیشرو.",
    rating: 10,
    published: true,
    verified: true,
    featured: true,
    views: 295,
  },
  {
    userName: "امیرحسین نامدار",
    userAvatar: "/images/home/real-comments/4.jpg",
    userRole: UserRoleType.STUDENT,
    text: "این دوره ترید واقعاً فوق‌العاده بود! از صفر شروع کردم و حالا با اطمینان ترید می‌کنم. تحلیل تکنیکال، مدیریت ریسک و روانشناسی معامله رو عالی یاد گرفتم.",
    rating: 10,
    published: true,
    verified: true,
    featured: true,
    views: 180,
  },
  {
    userName: "سارا محمدی",
    userAvatar: "/images/home/real-comments/5.jpg",
    userRole: UserRoleType.INVESTOR,
    text: "کیفیت آموزش بسیار بالا است. مربیان واقعاً به موضوع مسلط‌اند و تجربه‌شان قابل‌اعتماد است.",
    rating: 10,
    published: true,
    verified: true,
    featured: true,
    views: 210,
  },
  {
    userName: "علی رضایی",
    userAvatar: "/images/home/real-comments/6.jpg",
    userRole: UserRoleType.STUDENT,
    text: "بهترین سرمایه‌گذاری که برای توسعه مهارت‌های خود کردم. نتایج فوری و قابل‌توجه بود.",
    rating: 9,
    published: true,
    verified: true,
    featured: true,
    views: 160,
  },
];

export async function seedHomeTestimonials() {
  const existing = await prisma.comment.count({
    where: { featured: true, published: true },
  });

  if (existing > 0) {
    console.log(`   ℹ️  Featured comments already present (${existing}), skip.`);
    return { created: 0, updated: 0, total: existing };
  }

  let created = 0;
  for (const item of testimonials) {
    await prisma.comment.create({ data: item });
    created += 1;
  }

  console.log(`   ✅ Created ${created} featured home testimonials`);
  return { created, updated: 0, total: created };
}

export default seedHomeTestimonials;
