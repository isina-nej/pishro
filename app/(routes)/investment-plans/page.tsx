import InvestmentPlansPageContent from "@/components/investment-plans/pageContent";
import { Metadata } from "next";
import { getInvestmentPlansData } from "@/lib/services/landing-service";
import { investmentPlansFallback } from "@/lib/data/public-page-fallbacks";

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
  const investmentPlansData = (await getInvestmentPlansData()) || investmentPlansFallback;

  return (
    <InvestmentPlansPageContent investmentPlansData={investmentPlansData} />
  );
};

export default InvestmentPage;
