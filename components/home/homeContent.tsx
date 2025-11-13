// @/components/home/homeContent.tsx

import LandingOverlay from "./landingOverlay";
import MobileScrollSection from "./mobileScrollSection";
import CalculatorSection from "./calculatorSection";
import CoursesSec from "@/components/utils/CoursesSec.server";
import HomeComments from "./homeComments";
import NewsClub from "./newsClub";
import FloatingNotificationManager from "@/components/utils/floatingNotificationManager";

export default function HomePageContent() {
  return (
    <div className="w-full">
      <LandingOverlay />
      <MobileScrollSection />
      <CalculatorSection />
      <CoursesSec />
      <HomeComments />
      <NewsClub />
      <FloatingNotificationManager />
    </div>
  );
}
