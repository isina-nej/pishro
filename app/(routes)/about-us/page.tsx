import AboutUsContent from "@/components/aboutUs/pageContent";
import { Metadata } from "next";
import { getAboutPageData } from "@/lib/services/landing-service";
import { aboutPageFallback } from "@/lib/data/public-page-fallbacks";

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
  const aboutPage = (await getAboutPageData()) || aboutPageFallback;

  return (
    <>
      <AboutUsContent aboutPageData={aboutPage} />
    </>
  );
};

export default AboutUsPage;
