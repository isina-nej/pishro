// @/components/home/homeContent.tsx

import LandingOverlayServer from "./landingOverlay.server";
import MobileLandingServer from "./mobileLanding.server";
import MobileScrollSectionServer from "./mobileScrollSection.server";
import CalculatorSection from "./calculatorSection";
import CoursesSec from "@/components/utils/CoursesSec.server";
import NewsClub from "./newsClub";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection.server";

import FloatingNotificationManager from "@/components/utils/floatingNotificationManager";

export default async function HomePageContent() {
  return (
    <div className="home-shell w-full transition-colors">
      <div className="home-hero-stage">
        <LandingOverlayServer />
      </div>

      <div className="lg:hidden">
        <MobileLandingServer />
      </div>

      <div className="home-ambient-stage">
        <div className="home-section-stage">
          <MobileScrollSectionServer />
        </div>

        <div className="home-section-stage">
          <CalculatorSection />
        </div>

        <div className="home-section-stage">
          <CoursesSec />
        </div>

        <TestimonialsSection
          title="نظرات و تجربیات کاربران"
          subtitle="بهترین‌های بازار چرا ما را انتخاب می‌کنند"
          speed={50}
          limit={15}
        />

        <div className="home-section-stage home-news-stage">
          <NewsClub />
        </div>
      </div>

      <FloatingNotificationManager />
    </div>
  );
}
