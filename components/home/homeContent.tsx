// @/components/home/homeContent.tsx

import LandingOverlayServer from "./landingOverlay.server";
import MobileLandingServer from "./mobileLanding.server";
import MobileScrollSectionServer from "./mobileScrollSection.server";
import CalculatorSection from "./calculatorSection";
import CoursesSec from "@/components/utils/CoursesSec.server";
import HomeComments from "./homeComments";
import NewsClub from "./newsClub";
import WhyUs from "./whyUs";
import FloatingNotificationManager from "@/components/utils/floatingNotificationManager";

export default function HomePageContent() {
  return (
    <div className="w-full">
      {/* Desktop Landing - hidden on mobile */}
      <LandingOverlayServer />

      {/* WhyUs - desktop */}
      <WhyUs />

      {/* Mobile Landing - hidden on desktop */}
      <div className="lg:hidden">
        <MobileLandingServer />

        {/* WhyUs - mobile */}
        <WhyUs />
      </div>

      <MobileScrollSectionServer />
      <CalculatorSection />
      <CoursesSec />
      <HomeComments />
      <NewsClub />
      <FloatingNotificationManager />
    </div>
  );
}
