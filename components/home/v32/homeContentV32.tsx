// @/components/home/v32/homeContentV32.tsx

import V32LandingPage from "./V32LandingPage";
import CoursesSec from "@/components/utils/CoursesSec.server";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection.server";
import CalculatorSection from "../calculatorSection";
import NewsClub from "../newsClub";
import FloatingNotificationManager from "@/components/utils/floatingNotificationManager";
import { PublicContentProvider } from "@/components/site/PublicContentProvider";
import {
  getPublicContent,
  getPublicSiteChrome,
} from "@/lib/services/settings-service";
import { createVisibility } from "@/lib/site/hidable-pages";

export default async function HomeContentV32() {
  const [chrome, publicContent] = await Promise.all([
    getPublicSiteChrome(),
    getPublicContent(),
  ]);
  const { show } = createVisibility(chrome.hiddenPages);

  return (
    <PublicContentProvider content={publicContent}>
      <V32LandingPage
        showHero={show("home:hero")}
        showAudience={show("home:mobile-view")}
        phoneTel={chrome.footerContent.phoneTel}
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
          <CalculatorSection
            phone={chrome.footerContent.phone}
            phoneTel={chrome.footerContent.phoneTel}
          />
        </div>
      )}

      {show("home:news") && (
        <div className="home-section-stage home-news-stage">
          <NewsClub />
        </div>
      )}

      {show("home:notifications") && <FloatingNotificationManager />}
    </PublicContentProvider>
  );
}
