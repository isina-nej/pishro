// @/components/home/v32/homeContentV32.tsx

import V32LandingPage from "./V32LandingPage";
import CoursesSec from "@/components/utils/CoursesSec.server";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection.server";
import CalculatorSection from "../calculatorSection";
import NewsClub from "../newsClub";
import FloatingNotificationManager from "@/components/utils/floatingNotificationManager";
import { getHiddenPages } from "@/lib/services/settings-service";
import { createVisibility } from "@/lib/site/hidable-pages";

export default async function HomeContentV32() {
  const { show } = createVisibility(await getHiddenPages());

  return (
    <>
      <V32LandingPage
        showHero={show("home:hero")}
        showAudience={show("home:mobile-view")}
      />

      {show("home:courses") && (
        <div className="home-section-stage">
          <CoursesSec />
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

      {show("home:news") && (
        <div className="home-section-stage home-news-stage">
          <NewsClub />
        </div>
      )}

      {show("home:notifications") && <FloatingNotificationManager />}
    </>
  );
}
