/**
 * Seed Home Landing
 * Creates the homepage landing content
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedHomeLanding() {
    console.log("🌱 Starting to seed home landing...");

    try {
        // Create or update home landing
        const homeLanding = await prisma.homeLanding.upsert({
            where: { id: "default" },
            update: {},
            create: {
                id: "default",
                heroTitle: "پلتفرم جامع آموزش سرمایه‌گذاری و معامله‌گری",
                heroSubtitle:
                    "با پیشرو، دنیای بورس، ارز دیجیتال و سرمایه‌گذاری را از صفر تا صد بیاموزید",
                heroCtaText: "شروع یادگیری",
                heroCtaLink: "/courses",
                heroImageUrl: "/images/placeholder/hero.jpg",
                aboutTitle: "درباره پیشرو",
                aboutDescription:
                    "پیشرو یک پلتفرم آموزشی جامع برای یادگیری بورس، ارز دیجیتال، فارکس و سرمایه‌گذاری است. ما با تیمی از اساتید مجرب و برنامه‌های آموزشی به‌روز، شما را در مسیر موفقیت مالی همراهی می‌کنیم.",
                aboutImageUrl: "/images/placeholder/about.jpg",
                featuresTitle: "ویژگی‌های آموزش ما",
                features: JSON.stringify([
                    {
                        title: "آموزش تخصصی",
                        description: "دوره‌های جامع و کاربردی با اساتید مجرب",
                        icon: "🎓",
                    },
                    {
                        title: "پشتیبانی 24/7",
                        description: "پاسخگویی به سوالات شما در کمترین زمان",
                        icon: "💬",
                    },
                    {
                        title: "گواهینامه معتبر",
                        description: "دریافت گواهینامه از پیشرو پس از اتمام دوره",
                        icon: "🏆",
                    },
                    {
                        title: "محتوای به‌روز",
                        description: "بروزرسانی مداوم محتوا با آخرین تغییرات بازار",
                        icon: "📚",
                    },
                ]),
                testimonialsTitle: "نظرات دانشجویان",
                testimonials: JSON.stringify([
                    {
                        name: "علی رضایی",
                        role: "دانشجوی دوره تحلیل تکنیکال",
                        text: "دوره‌های پیشرو واقعاً کاربردی و عالی هستند. من توانستم در بورس موفق شوم.",
                        avatar: "/images/placeholder/avatar.jpg",
                        rating: 5,
                    },
                    {
                        name: "سارا محمدی",
                        role: "دانشجوی دوره ارز دیجیتال",
                        text: "اساتید پیشرو با تجربه و صبور هستند. پشتیبانی عالی دارند.",
                        avatar: "/images/placeholder/avatar.jpg",
                        rating: 5,
                    },
                ]),
                statsTitle: "آمار پیشرو",
                stats: JSON.stringify([
                    { label: "دانشجو", value: "5000+", icon: "👥" },
                    { label: "دوره آموزشی", value: "40+", icon: "📚" },
                    { label: "ساعت ویدیو", value: "500+", icon: "⏱️" },
                    { label: "رضایت", value: "95%", icon: "⭐" },
                ]),
                published: true,
            },
        });

        console.log("✅ Home landing seeded successfully!");
        return { created: 1, updated: 0, total: 1 };
    } catch (error) {
        console.error("❌ Error seeding home landing:", error);
        throw error;
    }
}

