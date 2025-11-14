import InvestmentPageContent from "@/components/investment-consulting/pageContent";
import { Metadata } from "next";
import { getInvestmentConsultingData } from "@/lib/services/landing-service";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getInvestmentConsultingData();

  return {
    title: data?.metaTitle || "مشاوره سرمایه‌گذاری | پیشرو",
    description:
      data?.metaDescription ||
      "دریافت مشاوره تخصصی سرمایه‌گذاری و بورس از کارشناسان مجرب پیشرو",
    keywords: data?.metaKeywords || [],
  };
}

const InvestmentPage = async () => {
  const data = await getInvestmentConsultingData();

  return <InvestmentPageContent initialData={data || undefined} />;
};

export default InvestmentPage;
