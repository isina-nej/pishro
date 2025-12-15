// @/components/home/mobileLanding.server.tsx

import MobileLanding from "./mobileLanding";
import {
  getHomeLandingData,
  getHomeSlides,
} from "@/lib/services/landing-service";

export default async function MobileLandingServer() {
  // Fetch all data in parallel
  const [homeLanding, slides] = await Promise.all([
    getHomeLandingData(),
    getHomeSlides(),
  ]);

  // Transform data for components
  const slidesData = slides.map((slide) => ({
    src: slide.imageUrl,
    title: slide.title,
    text: slide.description,
  }));

  return (
    <MobileLanding
      mainHeroTitle={
        homeLanding?.mainHeroTitle ||
        "پیشرو بزرگترین مؤسسه سرمایه‌ گذاری در ایران"
      }
      mainHeroSubtitle={homeLanding?.mainHeroSubtitle || "شروع مسیر موفقیت"}
      mainHeroCta1Link={homeLanding?.mainHeroCta1Link || "/business-consulting"}
      heroVideoUrl={homeLanding?.heroVideoUrl || "/videos/aboutUs.webm"}
      overlayTexts={
        homeLanding?.overlayTexts && homeLanding.overlayTexts.length > 0
          ? homeLanding.overlayTexts
          : [
              "پیشرو در مسیر سرمایه‌ گذاری هوشمند",
              "ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری، شما را در مسیر رشد مالی همراهی می‌کنیم.",
              "از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای و همراهی در مسیر رشد سرمایه شما، همه و همه در پیشرو فراهم است.",
              "پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.",
            ]
      }
      slides={slidesData}
    />
  );
}
