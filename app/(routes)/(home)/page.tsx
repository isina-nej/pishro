import HomePageContent from "@/components/home/homeContent";
import { Metadata } from "next";
import { getHomeLandingData } from "@/lib/services/landing-service";

export async function generateMetadata(): Promise<Metadata> {
  const homeLanding = await getHomeLandingData();

  const title = homeLanding?.metaTitle || "پیشرو | بزرگترین مؤسسه سرمایه‌ گذاری در ایران";
  const description =
    homeLanding?.metaDescription ||
    "آموزش تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری. از اصولی تا مشاوره حرفه‌ای";
  return {
    title,
    description,
    keywords: homeLanding?.metaKeywords || [],
    alternates: { canonical: "/" },
    openGraph: { title, description, type: "website" },
  };
}

const Home = () => <HomePageContent />;

export default Home;
