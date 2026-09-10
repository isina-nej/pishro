import type { Metadata } from "next";
import LibraryPageContent from "@/components/library/libraryContent";

export const metadata: Metadata = {
  title: "کتابخانه دیجیتال | پیشرو",
  description: "مجموعه منتخب کتاب‌های سرمایه‌ گذاری، بورس و ارز دیجیتال — پیشنهادهای تحریریه پیشرو.",
  alternates: { canonical: "/library" },
  openGraph: {
    title: "کتابخانه دیجیتال | پیشرو",
    description: "مجموعه منتخب کتاب‌های سرمایه‌ گذاری، بورس و ارز دیجیتال — پیشنهادهای تحریریه پیشرو.",
    type: "website",
  },
};

const LibraryPage = () => {
  return <LibraryPageContent />;
};

export default LibraryPage;
