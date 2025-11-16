import type { Metadata } from "next";
import PageContent from "@/components/investmentPortfolios/pageContent";

export const metadata: Metadata = {
  title: "سبدهای سرمایه‌گذاری | پیشرو",
  description:
    "با سبدهای سرمایه‌گذاری پیشرو، سرمایه خود را با بازدهی تضمین شده رشد دهید. انتخاب از بین سبدهای کم‌ریسک، متوسط و پرریسک.",
  keywords: [
    "سرمایه‌گذاری",
    "سبد سرمایه‌گذاری",
    "بازدهی تضمین شده",
    "سود ماهیانه",
    "کم‌ریسک",
    "پرریسک",
  ],
};

export default function InvestmentPortfoliosPage() {
  return <PageContent />;
}
