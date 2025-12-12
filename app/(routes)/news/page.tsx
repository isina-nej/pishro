import type { Metadata } from "next";
import NewsPageContents from "@/components/news/pageContent";

export const metadata: Metadata = {
  title: "اخبار مالی | پیشرو",
  description: "آخرین اخبار و تحلیل‌های بازار مالی، ارزهای دیجیتال و سرمایه‌گذاری",
};

export default function News() {
  return <NewsPageContents />;
}
