
import { Metadata } from "next";
import { getAboutPageData } from "@/lib/services/landing-service";

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await getAboutPageData();

  return {
    title: aboutPage?.metaTitle || "درباره ما | پیشرو",
    description:
      aboutPage?.metaDescription ||
      "آشنایی با تیم، تاریخچه و ماموریت مؤسسه سرمایه‌ گذاری پیشرو",
    keywords: aboutPage?.metaKeywords || [],
  };
}

const AboutUsPage = async () => {
  // Always show fallback message to match screenshot
  return (
    <div className="container-md py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        صفحه درباره ما
      </h1>
      <p className="text-gray-600">
        اطلاعات صفحه درباره ما در حال حاضر در دسترس نیست. لطفاً بعداً مراجعه
        کنید.
      </p>
    </div>
  );
};

export default AboutUsPage;
