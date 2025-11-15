import InvestmentPageContent from "@/components/investment-consulting/pageContent";
import { Metadata } from "next";
import { getBusinessConsultingData } from "@/lib/services/landing-service";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBusinessConsultingData();

  return {
    title: data?.metaTitle || "مشاوره سرمایه‌گذاری | پیشرو",
    description:
      data?.metaDescription ||
      "دریافت مشاوره تخصصی سرمایه‌گذاری و بورس از کارشناسان مجرب پیشرو",
    keywords: data?.metaKeywords || [],
  };
}

const InvestmentPage = async () => {
  return <InvestmentPageContent />;
};

export default InvestmentPage;
