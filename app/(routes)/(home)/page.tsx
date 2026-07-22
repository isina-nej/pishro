import HomePageContent from "@/components/home/homeContent";
import { Metadata } from "next";
import { getHomeLandingData } from "@/lib/services/landing-service";

export async function generateMetadata(): Promise<Metadata> {
  const homeLanding = await getHomeLandingData();

  return {
    title: homeLanding?.metaTitle || "پیشرو | بزرگترین مؤسسه سرمایه‌ گذاری در ایران",
    description:
      homeLanding?.metaDescription ||
      "آموزش تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری. از اصولی تا مشاوره حرفه‌ای",
    keywords: homeLanding?.metaKeywords || [],
  };
}

const Home = () => <HomePageContent />;

export default Home;
