import BusinessConsultingContent from "@/components/business-consulting/pageContent";
import { Metadata } from "next";
import { getBusinessConsultingData } from "@/lib/services/landing-service";
import { businessConsultingFallback } from "@/lib/data/public-page-fallbacks";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBusinessConsultingData();

  return {
    title: data?.metaTitle || "مشاوره کسب و کار | پیشرو",
    description:
      data?.metaDescription ||
      "دریافت مشاوره تخصصی کسب و کار راه‌اندازی استارتاپ از کارشناسان مجرب پیشرو",
    keywords: data?.metaKeywords || [],
  };
}

const BusinessConsultingPage = async () => {
  const businessConsultingData = (await getBusinessConsultingData()) || businessConsultingFallback;

  return (
    <>
      <BusinessConsultingContent businessConsultingData={businessConsultingData} />
    </>
  );
};

export default BusinessConsultingPage;
