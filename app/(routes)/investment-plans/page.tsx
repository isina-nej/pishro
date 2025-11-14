import InvestmentPlansPageContent from "@/components/investment-plans/pageContent";
import { Metadata } from "next";
import { getInvestmentPlansData } from "@/lib/services/landing-service";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getInvestmentPlansData();

  return {
    title: data?.metaTitle || "سبدهای سرمایه‌گذاری | پیشرو",
    description:
      data?.metaDescription ||
      "آشنایی با سبدهای سرمایه‌گذاری متنوع در ارز دیجیتال، بورس و ترکیبی",
    keywords: data?.metaKeywords || [],
  };
}

const InvestmentPage = async () => {
  const data = await getInvestmentPlansData();

  return <InvestmentPlansPageContent initialData={data || undefined} />;
};

export default InvestmentPage;
