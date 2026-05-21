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
    <div className="w-full bg-white dark:bg-cardBg transition-colors">
      {/* Desktop Landing - hidden on mobile */}
      <div className="shadow-backdrop">
        <LandingOverlayServer />
      </div>

      {/* Mobile Landing - hidden on desktop */}
      <div className="lg:hidden shadow-backdrop">
        <MobileLandingServer />
      </div>

      <div className="shadow-card">
        <MobileScrollSectionServer />
      </div>
      
      <div className="shadow-card">
        <CalculatorSection />
      </div>
      
      <div className="shadow-card">
        <CoursesSec />
      </div>
      
      {/* Premium Testimonials with Infinite Scroll - Using Database Comments */}
      <TestimonialsSection 
        title="نظرات و تجربیات کاربران"
        subtitle="بهترین‌های بازار چرا ما را انتخاب می‌کنند"
        speed={50}
        limit={15}
      />
      
      <div className="shadow-card">
        <NewsClub />
      </div>
      
      <FloatingNotificationManager />
    </div>
  );
}
