// @/components/home/homeContent.tsx

import LandingOverlayServer from "./landingOverlay.server";
import MobileScrollSectionServer from "./mobileScrollSection.server";
import CalculatorSection from "./calculatorSection";
import CoursesSec from "@/components/utils/CoursesSec.server";
import HomeComments from "./homeComments";
import NewsClub from "./newsClub";
import FloatingNotificationManager from "@/components/utils/floatingNotificationManager";

export default function HomePageContent() {
  return (
    <div className="w-full">
      <LandingOverlayServer />
      <MobileScrollSectionServer />
      <CalculatorSection />
      <CoursesSec />
      <HomeComments />
      <NewsClub />
      <FloatingNotificationManager />
    </div>
  );
}
