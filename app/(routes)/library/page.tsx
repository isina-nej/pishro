import type { Metadata } from "next";
import LibraryPageContent from "@/components/library/libraryContent";

export const metadata: Metadata = {
  title: "کتابخانه دیجیتال | پیشرو",
  description: "دسترسی به کتب و منابع آموزشی کامل برای بهبود دانش مالی و سرمایه‌گذاری شما",
};

const LibraryPage = () => {
  return <LibraryPageContent />;
};

export default LibraryPage;
