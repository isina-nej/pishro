// @/components/home/homeContent.tsx

import LandingOverlayServer from "./landingOverlay.server";
import MobileLandingServer from "./mobileLanding.server";
import MobileScrollSectionServer from "./mobileScrollSection.server";

import CoursesSec from "@/components/utils/CoursesSec.server";
import HomeComments from "./homeComments";
import NewsClub from "./newsClub";
import FloatingNotificationManager from "@/components/utils/floatingNotificationManager";

export default function HomePageContent() {
  return (
    <div className="w-full">
      {/* Desktop Landing - hidden on mobile */}
      <LandingOverlayServer />

      {/* Mobile Landing - hidden on desktop */}
      <div className="lg:hidden">
        <MobileLandingServer />
      </div>

      <MobileScrollSectionServer />
      {/* CalculatorSection moved to Business Consulting page */}
      <CoursesSec />
      <HomeComments />
      <NewsClub />
      <FloatingNotificationManager />
    </div>
  );
}
