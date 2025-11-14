import HomePageContent from "@/components/home/homeContent";
import { Metadata } from "next";
import {
  getHomeLandingData,
  getMobileScrollerSteps,
} from "@/lib/services/landing-service";

export async function generateMetadata(): Promise<Metadata> {
  const homeLanding = await getHomeLandingData();

  return {
    title:
      homeLanding?.metaTitle ||
      "پیشرو | بزرگترین مؤسسه سرمایه‌گذاری در ایران",
    description:
      homeLanding?.metaDescription ||
      "آموزش تخصصی بورس، بازارهای مالی و سرمایه‌گذاری. از آموزش اصولی تا مشاوره حرفه‌ای",
    keywords: homeLanding?.metaKeywords || [],
  };
}

export default async function Home() {
  const [homeLanding, mobileSteps] = await Promise.all([
    getHomeLandingData(),
    getMobileScrollerSteps(),
  ]);

  return (
    <HomePageContent
      initialData={
        homeLanding && mobileSteps
          ? { landing: homeLanding, mobileSteps }
          : undefined
      }
    />
  );
}
