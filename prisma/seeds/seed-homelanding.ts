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
                heroCta1Text: "شروع یادگیری",
                heroCta1Link: "/courses",
                heroVideoUrl: "/videos/hero-background.mp4",
                overlayTexts: [
                    "آموزش تحلیل تکنیکال",
                    "معامله‌گری حرفه‌ای",
                    "سرمایه‌گذاری هوشمند",
                ],
                statsData: JSON.stringify([
                    { label: "دانشجو", value: 5000, suffix: "+" },
                    { label: "دوره", value: 40, suffix: "+" },
                    { label: "ساعت ویدیو", value: 500, suffix: "+" },
                    { label: "رضایت", value: 95, suffix: "%" },
                ]),
                whyUsTitle: "چرا پیشرو؟",
                whyUsDescription:
                    "پیشرو با تیمی از اساتید مجرب و برنامه‌های آموزشی به‌روز، شما را در مسیر موفقیت مالی همراهی می‌کند",
                whyUsItems: JSON.stringify([
                    {
                        label: "آموزش تخصصی",
                        title: "دوره‌های جامع",
                        text: "آموزش کامل با اساتید مجرب",
                        btnLabel: "مشاهده دوره‌ها",
                        btnHref: "/courses",
                        imagePath: "/images/placeholder/course.jpg",
                    },
                    {
                        label: "پشتیبانی",
                        title: "پشتیبانی 24/7",
                        text: "پاسخگویی سریع به سوالات",
                        btnLabel: "تماس با ما",
                        btnHref: "/contact",
                        imagePath: "/images/placeholder/support.jpg",
                    },
                ]),
                newsClubTitle: "باشگاه خبری پیشرو",
                newsClubDescription: "آخرین اخبار و تحلیل‌های بازار را دنبال کنید",
                calculatorTitle: "محاسبه سود سرمایه‌گذاری",
                calculatorDescription:
                    "با ماشین حساب پیشرو، سود احتمالی سرمایه‌گذاری خود را محاسبه کنید",
                calculatorInPersonPhone: "02191001234",
                calculatorOnlineTelegram: "@PishroSupport",
                calculatorOnlineTelegramLink: "https://t.me/PishroSupport",
                metaTitle: "پیشرو - پلتفرم آموزش سرمایه‌گذاری",
                metaDescription:
                    "آموزش بورس، ارز دیجیتال و سرمایه‌گذاری با پیشرو",
                metaKeywords: ["بورس", "ارز دیجیتال", "سرمایه‌گذاری", "آموزش"],
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
