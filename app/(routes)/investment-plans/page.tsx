import InvestmentPlansPageContent from "@/components/investment-plans/pageContent";
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
  // Fetch investment plans page data
  const investmentPlansData = await getInvestmentPlansData();

  // If no data is available, show a fallback message
  if (!investmentPlansData) {
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
  }

  return (
    <InvestmentPlansPageContent investmentPlansData={investmentPlansData} />
  );
};

export default InvestmentPage;
