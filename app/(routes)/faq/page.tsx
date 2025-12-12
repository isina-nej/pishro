import type { Metadata } from "next";
import FaqPageContent from "@/components/faq/pageContent";

export const metadata: Metadata = {
  title: "سوالات متداول | پیشرو",
  description: "پاسخ به سوالات رایج درباره دوره‌ها، سرمایه‌گذاری و خدمات پیشرو",
};

const FaqPage = () => {
  return (
    <div>
      <FaqPageContent />
    </div>
  );
};

export default FaqPage;
