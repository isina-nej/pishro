import InvestmentPlansPageContent from "@/components/investment-plans/pageContent";
import { Metadata } from "next";
import { getInvestmentPlansData } from "@/lib/services/landing-service";
import { investmentPlansFallback } from "@/lib/data/public-page-fallbacks";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getInvestmentPlansData();

  const title = data?.metaTitle || "سبدهای سرمایه‌ گذاری | پیشرو";
  const description =
    data?.metaDescription ||
    "آشنایی با سبدهای سرمایه‌ گذاری متنوع در ارز دیجیتال، بورس و ترکیبی";
  return {
    title,
    description,
    keywords: data?.metaKeywords || [],
    alternates: { canonical: "/investment-plans" },
    openGraph: { title, description, type: "website" },
  };
}

const InvestmentPage = async () => {
  const investmentPlansData = (await getInvestmentPlansData()) || investmentPlansFallback;

  return (
    <InvestmentPlansPageContent investmentPlansData={investmentPlansData} />
  );
};

export default InvestmentPage;
