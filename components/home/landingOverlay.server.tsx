// @/components/home/landingOverlay.server.tsx

import LandingOverlay from "./landingOverlay";
import {
  getHomeLandingData,
  getHomeSlides,
  getHomeMiniSliders,
} from "@/lib/services/landing-service";

export default async function LandingOverlayServer() {
  // Fetch all data in parallel
  const [homeLanding, slides, miniSlider1, miniSlider2] = await Promise.all([
    getHomeLandingData(),
    getHomeSlides(),
    getHomeMiniSliders(1),
    getHomeMiniSliders(2),
  ]);

  // Transform data for components
  const slidesData = slides.map((slide) => ({
    src: slide.imageUrl,
    title: slide.title,
    text: slide.description,
  }));

  const miniSlider1Data = miniSlider1.map((s) => s.imageUrl);
  const miniSlider2Data = miniSlider2.map((s) => s.imageUrl);

  return (
    <LandingOverlay
      mainHeroTitle={
        homeLanding?.mainHeroTitle ||
        "پیشرو بزرگترین مؤسسه سرمایه‌گذاری در ایران"
      }
      mainHeroSubtitle={homeLanding?.mainHeroSubtitle || "شروع مسیر موفقیت"}
      mainHeroCta1Link={homeLanding?.mainHeroCta1Link || "/business-consulting"}
      heroVideoUrl={homeLanding?.heroVideoUrl || "/videos/aboutUs.webm"}
      overlayTexts={
        homeLanding?.overlayTexts && homeLanding.overlayTexts.length > 0
          ? homeLanding.overlayTexts
          : [
              "پیشرو در مسیر سرمایه‌گذاری هوشمند",
              "ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌گذاری، شما را در مسیر رشد مالی همراهی می‌کنیم.",
              "از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای و همراهی در مسیر رشد سرمایه شما، همه و همه در پیشرو فراهم است.",
              "پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.",
            ]
      }
      slides={slidesData}
      miniSlider1Data={miniSlider1Data}
      miniSlider2Data={miniSlider2Data}
    />
  );
}
