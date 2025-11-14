import AboutUsContent from "@/components/aboutUs/pageContent";
import { Metadata } from "next";
import { getAboutPageData } from "@/lib/services/landing-service";

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await getAboutPageData();

  return {
    title: aboutPage?.metaTitle || "درباره ما | پیشرو",
    description:
      aboutPage?.metaDescription ||
      "آشنایی با تیم، تاریخچه و ماموریت مؤسسه سرمایه‌گذاری پیشرو",
    keywords: aboutPage?.metaKeywords || [],
  };
}

const AboutUsPage = async () => {
  const aboutPage = await getAboutPageData();

  return (
    <>
      <AboutUsContent initialData={aboutPage || undefined} />
    </>
  );
};

export default AboutUsPage;
