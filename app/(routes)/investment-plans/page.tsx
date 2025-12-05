
import { Metadata } from "next";
import { getInvestmentPlansData } from "@/lib/services/landing-service";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getInvestmentPlansData();

  return {
    title: data?.metaTitle || "سبدهای سرمایه‌ گذاری | پیشرو",
    description:
      data?.metaDescription ||
      "آشنایی با سبدهای سرمایه‌ گذاری متنوع در ارز دیجیتال، بورس و ترکیبی",
    keywords: data?.metaKeywords || [],
  };
}

const InvestmentPage = async () => {
  // Always show fallback message to match screenshot
  return (
    <div className="container-md py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        سبدهای سرمایه‌ گذاری
      </h1>
      <p className="text-gray-600">
        اطلاعات سبدهای سرمایه‌ گذاری در حال حاضر در دسترس نیست. لطفاً بعداً
        مراجعه کنید.
      </p>
    </div>
  );
};

export default InvestmentPage;
