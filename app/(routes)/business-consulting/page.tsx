
import { Metadata } from "next";
import { getBusinessConsultingData } from "@/lib/services/landing-service";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBusinessConsultingData();

  return {
    title: data?.metaTitle || "مشاوره کسب و کار | پیشرو",
    description:
      data?.metaDescription ||
      "دریافت مشاوره تخصصی کسب و کار و راه‌اندازی استارتاپ از کارشناسان مجرب پیشرو",
    keywords: data?.metaKeywords || [],
  };
}

const BusinessConsultingPage = async () => {
  // Always show fallback message to match screenshot
  return (
    <div className="container-md py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        صفحه مشاوره کسب و کار
      </h1>
      <p className="text-gray-600">
        اطلاعات صفحه مشاوره کسب و کار در حال حاضر در دسترس نیست. لطفاً بعداً
        مراجعه کنید.
      </p>
    </div>
  );
};

export default BusinessConsultingPage;
