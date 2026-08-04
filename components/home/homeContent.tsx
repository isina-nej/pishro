// @/components/home/homeContent.tsx

import LandingOverlayServer from "./landingOverlay.server";
import MobileLandingServer from "./mobileLanding.server";
import MobileScrollSectionServer from "./mobileScrollSection.server";
import CalculatorSection from "./calculatorSection";
import CoursesSec from "@/components/utils/CoursesSec.server";
import NewsClub from "./newsClub";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection.server";

import FloatingNotificationManager from "@/components/utils/floatingNotificationManager";
import { getHiddenPages } from "@/lib/services/settings-service";
import { isSectionHidden } from "@/lib/site/hidable-pages";

export default async function HomePageContent() {
  const hidden = await getHiddenPages();
  const show = (sectionId: string) => !isSectionHidden(sectionId, hidden);

  return (
    <div className="home-shell w-full transition-colors">
      <div className="home-hero-stage">
        <LandingOverlayServer showAlbum={show("home:album")} />
      </div>

      <div className="lg:hidden">
        <MobileLandingServer />
      </div>

      <div className="home-ambient-stage">
        {show("home:mobile-view") && (
          <div className="home-section-stage">
            <MobileScrollSectionServer />
          </div>
        )}

        {show("home:comments") && (
          <div className="home-section-stage">
            <TestimonialsSection
              title="نظرات و تجربیات کاربران"
              subtitle="بهترین‌های بازار چرا ما را انتخاب می‌کنند"
              speed={50}
              limit={15}
            />
          </div>
        )}

        {show("home:calculator") && (
          <div className="home-section-stage">
            <CalculatorSection />
          </div>
        )}

        {show("home:courses") && (
          <div className="home-section-stage">
            <CoursesSec />
          </div>
        )}

        {show("home:news") && (
          <div className="home-section-stage home-news-stage">
            <NewsClub />
          </div>
        )}
      </div>

      <FloatingNotificationManager />
    </div>
  );
}
