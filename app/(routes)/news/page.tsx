import type { Metadata } from "next";
import NewsPageContents from "@/components/news/pageContent";

export const metadata: Metadata = {
  title: "مقالات و اخبار | پیشرو",
  description: "تازه‌ترین اخبار و تحلیل‌های بازار سرمایه، بورس و ارز دیجیتال از تحریریه پیشرو.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "مقالات و اخبار | پیشرو",
    description: "تازه‌ترین اخبار و تحلیل‌های بازار سرمایه، بورس و ارز دیجیتال از تحریریه پیشرو.",
    type: "website",
  },
};

export default function News() {
  return <NewsPageContents />;
}
