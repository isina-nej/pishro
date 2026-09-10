import BusinessConsultingContent from "@/components/business-consulting/pageContent";
import { Metadata } from "next";
import { getBusinessConsultingData } from "@/lib/services/landing-service";
import { businessConsultingFallback } from "@/lib/data/public-page-fallbacks";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBusinessConsultingData();

  const title = data?.metaTitle || "مشاوره کسب و کار | پیشرو";
  const description =
    data?.metaDescription ||
    "دریافت مشاوره تخصصی کسب و کار راه‌اندازی استارتاپ از کارشناسان مجرب پیشرو";
  return {
    title,
    description,
    keywords: data?.metaKeywords || [],
    alternates: { canonical: "/business-consulting" },
    openGraph: { title, description, type: "website" },
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
